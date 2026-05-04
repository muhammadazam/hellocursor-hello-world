import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md flex-1 px-4 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Forgot password</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Password reset by email is not configured in this demo app. To add it, connect an email provider (for
          example Resend or SendGrid), store reset tokens in your database, and send secure links.
        </p>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          If you still know your password, you can change it from{" "}
          <Link href="/profile" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            Profile
          </Link>
          .
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
