import { ResourcePage } from "@/components/admin/resource-page";
export default function Page() {
  return (
    <ResourcePage
      title="Sellers"
      description="Approve, suspend and audit pilot sellers."
      action="Invite seller"
      columns={["Business", "Category", "Payment", "Status", "Orders"]}
      rows={[
        ["Amara Beauty", "Beauty", "Verified", "Active", "18"],
        ["Dami Styles", "Fashion", "Pending", "Awaiting approval", "0"],
        ["Home Finds PH", "Home", "Verified", "Active", "12"],
      ]}
    />
  );
}
