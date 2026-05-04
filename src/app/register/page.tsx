import { auth } from "@/auth";
import RegisterForm from "@/components/register-form";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <RegisterForm />
    </div>
  );
}
