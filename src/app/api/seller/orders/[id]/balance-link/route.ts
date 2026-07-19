import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
import {createOpaqueToken} from "@/lib/security/tokens";
import {publicConfig} from "@/lib/config";
import {audit} from "@/server/audit";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params,session=await createClient(),{data:claims}=await session.auth.getClaims(),userId=claims?.claims?.sub;
    if(!userId)return NextResponse.json({error:"Sign in required"},{status:401});
    const {data:order}=await session.from("orders").select("id,status,total_due_kobo,total_paid_kobo").eq("id",id).single();
    if(!order)return NextResponse.json({error:"Order not found"},{status:404});
    const outstanding=Number(order.total_due_kobo)-Number(order.total_paid_kobo);
    if(outstanding<=0)return NextResponse.json({error:"This order has no outstanding balance"},{status:409});
    if(!["partially_paid","paid","confirmed","processing","awaiting_stock"].includes(order.status))return NextResponse.json({error:"A balance link is not available for this order status"},{status:409});
    const db=createAdminClient(),token=createOpaqueToken(),expiresAt=new Date(Date.now()+7*86400000);
    await db.from("order_payment_links").update({status:"revoked"}).eq("order_id",id).eq("status","active");
    const {error}=await db.from("order_payment_links").insert({order_id:id,public_token_hash:token.hash,payment_type:"balance",expires_at:expiresAt.toISOString(),created_by:userId});
    if(error)throw error;
    await audit({actorId:userId,action:"order.balance_link_created",resourceType:"order",resourceId:id,after:{outstandingKobo:outstanding,expiresAt:expiresAt.toISOString()},request});
    return NextResponse.json({url:`${publicConfig.NEXT_PUBLIC_APP_URL}/balance/${token.token}`,expiresAt:expiresAt.toISOString(),outstandingKobo:outstanding});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Could not create balance link"},{status:400})}
}
