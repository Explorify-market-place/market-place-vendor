import { redirect } from "next/navigation";

export default function VendorSignupRedirect() {
  redirect("/auth/signin");
}
