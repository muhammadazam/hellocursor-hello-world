import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const displayName = session?.user?.name?.trim() || "there";

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-20 dark:bg-zinc-950">
      <main className="max-w-lg text-center">
        {session?.user ? (
          <>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Hello {displayName}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              You are signed in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{session.user.email}</span>
              .
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/profile"
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Manage profile
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Hello World</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Create an account to see a personalized greeting and manage your profile.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
