import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {nanoid} from "nanoid";
import {z} from "zod";
import {depositDue} from "@/features/payments/deposit";
import {isDistinctReferral} from "@/features/rewards/rules";
import {featureFlags,publicConfig} from "@/lib/config";
import {initializePaystack} from "@/lib/paystack/client";
import {normalizeNigerianPhone} from "@/lib/security/phone";
import {enforceRateLimit,RateLimitError} from "@/lib/security/rate-limit";
import {requestIdentifier} from "@/lib/security/request";
import {verifySignedValue} from "@/lib/security/signed-value";
import {createOpaqueToken,hashToken} from "@/lib/security/tokens";
import {createAdminClient} from "@/lib/supabase/admin";

const schema=z.object({
  campaignCode:z.string().min(3).max(32),
  variantId:z.uuid(),
  quantity:z.number().int().min(1).max(20),
  fullName:z.string().trim().min(2).max(100),
  phone:z.string().min(10).max(24),
  email:z.email().max(254),
  fulfilmentMethod:z.enum(["pickup","seller_delivery","dispatch","waybill","meet_up","other"]),
  deliveryAddress:z.string().trim().max(600).optional(),
  buyerNote:z.string().trim().max(500).optional(),
  rewardCode:z.string().min(8).max(100).optional(),
});

function safeMessage(error:unknown){
  const message=error instanceof Error?error.message:"";
  const rewardMessages:Record<string,string>={
    reward_not_found:"That reward was not found.",reward_unavailable:"That reward is no longer available.",
    reward_wrong_seller:"That reward belongs to another seller.",reward_wrong_owner:"Use the phone number that earned this reward.",
    reward_expired:"That reward has expired.",reward_referral_conflict:"A reward cannot be combined with a referral.",
    reward_already_applied:"A reward is already applied to this order.",
  };
  return rewardMessages[message]??(message==="insufficient_stock"?"That option has just sold out.":"Checkout could not start. Please try again.");
}

export async function POST(request:Request){
  let createdOrderId:string|undefined;
  try{
    await enforceRateLimit({scope:"checkout_initialize",identifier:requestIdentifier(request),limit:12,windowSeconds:600});
    const input=schema.parse(await request.json());
    const phone=normalizeNigerianPhone(input.phone);
    if(!featureFlags.payments){
      if(process.env.NODE_ENV!=="production")return NextResponse.json({authorizationUrl:`/payment/callback?reference=DEMO-${nanoid(10)}&demo=1`});
      return NextResponse.json({error:"Secure payments are not enabled for this pilot yet."},{status:503});
    }

    const db=createAdminClient();
    const {data:campaign,error:campaignError}=await db.from("campaigns")
      .select("*,product:products(*),seller:seller_businesses(*),payment_account:seller_payment_accounts(*)")
      .eq("short_code",input.campaignCode).eq("status","active").single();
    if(campaignError||!campaign)throw new Error("campaign_unavailable");
    if(campaign.ends_at&&new Date(campaign.ends_at)<=new Date())throw new Error("campaign_unavailable");
    const {data:variant}=await db.from("product_variants").select("*")
      .eq("id",input.variantId).eq("product_id",campaign.product_id).eq("is_active",true).single();
    if(!variant)throw new Error("variant_unavailable");

    const unitPrice=Number(campaign.public_price_kobo);
    const originalTotal=unitPrice*input.quantity;
    const {data:customer,error:customerError}=await db.from("customers").upsert({
      full_name:input.fullName,normalized_phone:phone,email:input.email.toLowerCase(),
    },{onConflict:"normalized_phone,email"}).select().single();
    if(customerError)throw customerError;

    let referralId:string|null=null;
    const signed=(await cookies()).get("skwer_referral")?.value;
    const secret=process.env.REFERRAL_TOKEN_SECRET;
    const code=signed&&secret?verifySignedValue(signed,secret):null;
    if(code&&featureFlags.rewards&&!input.rewardCode){
      const {data:link}=await db.from("referral_links")
        .select("*,referrer:customers!referral_links_referrer_customer_id_fkey(normalized_phone,email)")
        .eq("public_code",code).eq("campaign_id",campaign.id).eq("status","active")
        .gt("attribution_expires_at",new Date().toISOString()).maybeSingle();
      const referrer=Array.isArray(link?.referrer)?link.referrer[0]:link?.referrer;
      if(link&&referrer&&isDistinctReferral({phone:referrer.normalized_phone,email:referrer.email},{phone,email:input.email}))referralId=link.id;
    }

    const token=createOpaqueToken();
    const reference=`SKW-${Date.now().toString(36).toUpperCase()}-${nanoid(6).toUpperCase()}`;
    const snapshot={...campaign.pricing_snapshot,paymentMode:campaign.payment_mode,totalOrderValueKobo:originalTotal};
    const {data:order,error:orderError}=await db.from("orders").insert({
      public_token_hash:token.hash,public_reference:reference,seller_id:campaign.seller_id,customer_id:customer.id,
      campaign_id:campaign.id,status:"payment_pending",fulfilment_method:input.fulfilmentMethod,
      delivery_address:input.deliveryAddress||null,item_subtotal_kobo:originalTotal,total_due_kobo:originalTotal,
      seller_target_kobo:Number(campaign.seller_minimum_take_home_kobo)*input.quantity,
      platform_target_kobo:Number(campaign.pricing_snapshot.platformRevenueKobo??0)*input.quantity,
      reward_funding_kobo:referralId?Number(campaign.referral_reward_kobo)*input.quantity:0,
      paystack_fee_estimate_kobo:Number(campaign.pricing_snapshot.estimatedPaystackFeeKobo??0)*input.quantity,
      buyer_note:input.buyerNote||null,referred_by_referral_id:referralId,pricing_snapshot:snapshot,
    }).select().single();
    if(orderError)throw orderError;
    createdOrderId=order.id;
    const {error:itemError}=await db.from("order_items").insert({
      order_id:order.id,product_id:campaign.product_id,variant_id:variant.id,product_name_snapshot:campaign.product.name,
      variant_snapshot:{option1:variant.option_1_value,option2:variant.option_2_value},quantity:input.quantity,
      unit_public_price_kobo:unitPrice,unit_seller_target_kobo:Number(campaign.seller_minimum_take_home_kobo),
    });
    if(itemError)throw itemError;
    if(referralId){
      const {error:attributionError}=await db.from("referral_attributions").insert({
        referral_link_id:referralId,referred_customer_id:customer.id,order_id:order.id,status:"checkout_started",
      });
      if(attributionError)throw attributionError;
    }
    if(campaign.stock_mode==="fixed"){
      const {error:reserveError}=await db.rpc("reserve_variant",{
        p_order:order.id,p_variant:variant.id,p_quantity:input.quantity,
        p_expires:new Date(Date.now()+Number(campaign.reservation_minutes)*60000).toISOString(),
      });
      if(reserveError)throw reserveError;
    }

    let rewardAppliedKobo=0;
    if(input.rewardCode&&featureFlags.rewards){
      const {data:amount,error:rewardError}=await db.rpc("redeem_reward_atomic",{
        p_order:order.id,p_reward_hash:hashToken(input.rewardCode),p_normalized_phone:phone,
      });
      if(rewardError)throw new Error(rewardError.message);
      rewardAppliedKobo=Number(amount);
    }
    const totalDue=originalTotal-rewardAppliedKobo;
    if(totalDue<=0)throw new Error("reward_covers_order");
    const paymentMode=campaign.payment_mode as "full"|"fixed_deposit"|"percentage_deposit";
    const dueNow=depositDue(totalDue,paymentMode,campaign.deposit_value==null?undefined:Number(campaign.deposit_value));
    const paymentReference=`PAY-${nanoid(20)}`;
    const {error:paymentError}=await db.from("payments").insert({
      order_id:order.id,provider_reference:paymentReference,amount_kobo:dueNow,payment_type:paymentMode==="full"?"full":"deposit",
    });
    if(paymentError)throw paymentError;
    const account=Array.isArray(campaign.payment_account)?campaign.payment_account[0]:campaign.payment_account;
    const paystack=await initializePaystack({
      email:input.email,amount:dueNow,reference:paymentReference,
      callbackUrl:`${publicConfig.NEXT_PUBLIC_APP_URL}/payment/callback`,
      subaccount:featureFlags.splitPayments?account?.subaccount_code:undefined,
      transactionCharge:Number(campaign.pricing_snapshot.platformRevenueKobo??0),
      metadata:{orderReference:reference,paymentType:paymentMode,rewardAppliedKobo},
    });
    await db.from("payments").update({authorization_url:paystack.data.authorization_url,status:"pending"}).eq("provider_reference",paymentReference);
    return NextResponse.json({authorizationUrl:paystack.data.authorization_url,orderToken:token.token,dueNowKobo:dueNow,totalDueKobo:totalDue,rewardAppliedKobo});
  }catch(error){
    console.error("checkout-initialize",{error,createdOrderId});
    if(createdOrderId){
      const message=error instanceof Error?error.message:"checkout_initialization_failed";
      try{const {error:cleanupError}=await createAdminClient().rpc("compensate_checkout_failure",{p_order:createdOrderId,p_reason:message});if(cleanupError)console.error("checkout-compensation",cleanupError)}catch(cleanupError){console.error("checkout-compensation",cleanupError)}
    }
    if(error instanceof RateLimitError)return NextResponse.json({error:error.message},{status:error.status});
    return NextResponse.json({error:safeMessage(error)},{status:400});
  }
}
