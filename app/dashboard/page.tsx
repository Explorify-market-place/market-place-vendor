import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/db-helpers";
import VendorDashboard from "@/components/vendor/VendorDashboard";

export default async function DashboardPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch fresh user data from database (not from token)
  const dbUser = await getUserById(session.user.id);

  // If user not found in database or not a vendor
  if (!dbUser || dbUser.role !== "vendor") {
    redirect("/auth/signin");
  }

  // Prepare user object with FRESH data from database
  const user = {
    id: dbUser.userId,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    vendorVerified: dbUser.vendorVerified, 
  };

  return <VendorDashboard user={user} />;
}