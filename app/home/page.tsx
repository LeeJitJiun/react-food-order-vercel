import { redirect } from "next/navigation";

export default async function MainAppPage() {
  // Redirect to root page (which is now the home page)
  redirect("/");
}
