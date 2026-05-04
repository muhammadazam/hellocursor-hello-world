import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          HelloCursor
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
