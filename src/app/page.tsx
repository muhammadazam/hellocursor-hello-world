export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hello World
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Ready to deploy on Vercel.
        </p>
      </main>
    </div>
  );
}
