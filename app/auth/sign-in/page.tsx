import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const session = await auth();

  // Redirect if already authenticated
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
