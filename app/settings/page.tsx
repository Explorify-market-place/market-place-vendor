import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/db-helpers";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  // Fetch fresh user data from database
  const dbUser = await getUserById(session.user.id);

  // If user not found in database or not a vendor
  if (!dbUser || dbUser.role !== "vendor") {
    redirect("/auth/sign-in");
  }

  return <SettingsForm />;
}
