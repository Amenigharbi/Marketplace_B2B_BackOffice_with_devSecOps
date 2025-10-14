import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function Root() {
  const session = await auth();

  if (!session?.user) {
    redirect("/fr/login");
  } else {
    redirect("/fr/marketplace/dashboard");
  }
}
