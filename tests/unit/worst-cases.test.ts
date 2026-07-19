import {describe,expect,it} from "vitest";
import {kobo,roundUp} from "@/lib/money";
import {depositDue} from "@/features/payments/deposit";
import {allowedOrderTransitions,canTransition} from "@/features/orders/states";
import {isDistinctReferral,validateReward} from "@/features/rewards/rules";
import {chooseAttribution} from "@/features/referrals/attribution";
import {normalizeNigerianPhone} from "@/lib/security/phone";
import {signValue,verifySignedValue} from "@/lib/security/signed-value";

describe("money boundary safety",()=>{
  it.each([-1,1.5,Number.NaN,Number.POSITIVE_INFINITY,Number.MAX_SAFE_INTEGER+1])("rejects invalid kobo: %s",value=>expect(()=>kobo(value)).toThrow(RangeError));
  it("rejects invalid rounding increments",()=>expect(()=>roundUp(100,0)).toThrow(RangeError));
  it("does not let a fixed deposit exceed the order total",()=>expect(depositDue(10_000,"fixed_deposit",20_000)).toBe(10_000));
  it.each([0,-1,10_001])("rejects unsafe deposit percentages: %s",value=>expect(()=>depositDue(10_000,"percentage_deposit",value)).toThrow(RangeError));
  it("rounds fractional percentage deposits upward",()=>expect(depositDue(101,"percentage_deposit",5000)).toBe(51));
});

describe("order state-machine worst cases",()=>{
  it("rejects unknown states, self transitions and terminal-state exits",()=>{
    expect(canTransition("unknown","paid")).toBe(false);
    for(const state of Object.keys(allowedOrderTransitions))expect(canTransition(state,state)).toBe(false);
    for(const terminal of ["refunded","cancelled","expired"])expect(allowedOrderTransitions[terminal]).toEqual([]);
  });
  it("never allows an unpaid order to become fulfilled",()=>{
    for(const status of ["confirmed","processing","ready_for_pickup","out_for_delivery","delivered","picked_up"])
      expect(canTransition("payment_pending",status)).toBe(false);
  });
});

describe("reward and referral abuse prevention",()=>{
  const base={sellerId:"seller-a",ownerPhone:"2348031234567",amountKobo:5_000,status:"available" as const,expiresAt:null};
  const input={sellerId:"seller-a",buyerPhone:"2348031234567",orderSubtotalKobo:3_000,hasReferral:false};
  it("caps credit at the order subtotal",()=>expect(validateReward({reward:base,...input})).toEqual({valid:true,amountKobo:3_000}));
  it("rejects wrong seller, wrong phone, expired, unavailable, and stacked credit",()=>{
    expect(validateReward({reward:{...base,sellerId:"seller-b"},...input}).valid).toBe(false);
    expect(validateReward({reward:base,...input,buyerPhone:"2348099999999"}).valid).toBe(false);
    expect(validateReward({reward:{...base,expiresAt:new Date(0)},...input}).valid).toBe(false);
    expect(validateReward({reward:{...base,status:"redeemed"},...input}).valid).toBe(false);
    expect(validateReward({reward:base,...input,hasReferral:true}).valid).toBe(false);
  });
  it("treats phone or case-insensitive email reuse as self-referral",()=>{
    expect(isDistinctReferral({phone:"1",email:"one@example.com"},{phone:"1",email:"two@example.com"})).toBe(false);
    expect(isDistinctReferral({phone:"1",email:"ONE@example.com"},{phone:"2",email:"one@example.com"})).toBe(false);
  });
  it("drops expired attribution and honours explicit removal",()=>{
    const expired={code:"OLD",expiresAt:new Date(0)},valid={code:"NEW",expiresAt:new Date(Date.now()+60_000)};
    expect(chooseAttribution({existing:expired,incoming:null,checkoutStarted:false,explicitlyRemoved:false})).toBeNull();
    expect(chooseAttribution({existing:valid,incoming:valid,checkoutStarted:false,explicitlyRemoved:true})).toBeNull();
  });
});

describe("untrusted input safety",()=>{
  it.each(["","8031234567","2341234567890","0803123456","080312345678","not-a-phone"])("rejects invalid Nigerian phone: %s",phone=>expect(()=>normalizeNigerianPhone(phone)).toThrow());
  it("rejects malformed and tampered signed values without throwing",()=>{
    const signed=signValue("order-id","secret-a");
    expect(verifySignedValue(signed,"secret-a")).toBe("order-id");
    expect(verifySignedValue(signed,"secret-b")).toBeNull();
    expect(verifySignedValue("missing-signature","secret-a")).toBeNull();
    expect(verifySignedValue(`${signed}x`,"secret-a")).toBeNull();
  });
});
