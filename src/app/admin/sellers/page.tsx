import { ResourcePage } from "@/components/admin/resource-page";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
  const db=await createClient();
  const {data}=await db.from("seller_businesses").select("business_name,category,is_active,is_approved,payment:seller_payment_accounts(provider_verified,status),orders(count)").order("created_at",{ascending:false});
  const rows=(data??[]).map((seller)=>{const payment=Array.isArray(seller.payment)?seller.payment[0]:seller.payment;const orders=Array.isArray(seller.orders)?seller.orders[0]:seller.orders;return[seller.business_name,seller.category,payment?.provider_verified?"Verified":payment?.status??"Not submitted",seller.is_active?(seller.is_approved?"Active":"Awaiting approval"):"Suspended",String(orders?.count??0)]});
  return <ResourcePage title="Sellers" description="Real seller approval and payment state. Approval mutations remain disabled until the audited endpoint is complete." columns={["Business","Category","Payment","Status","Orders"]} rows={rows}/>;
}
