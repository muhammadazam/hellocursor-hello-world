import { Suspense } from "react";
import { auth } from "@/auth";
import LoginForm from "@/components/login-form";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session) redirect("/");

  const sp = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      {sp.registered === "1" ? (
        <p className="mb-6 max-w-md rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-100">
          Account created. You can sign in below.
        </p>
      ) : null}
      <Suspense
        fallback={
          <div className="text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
