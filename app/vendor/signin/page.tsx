// app/vendor/signin/page.tsx
import { redirect } from "next/navigation";

export default function VendorSigninRedirect() {
  redirect("/auth/signin");
}
