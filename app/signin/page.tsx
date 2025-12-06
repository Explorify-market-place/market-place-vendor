// app/signin/page.tsx
import { redirect } from "next/navigation";

export default function SigninRedirect() {
  redirect("/auth/signin");
}
