import { auth } from "@/auth";
import ProfileForm from "@/components/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Your profile</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Update how you appear when signed in.</p>
      <div className="mt-8">
        <ProfileForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }}
        />
      </div>
    </div>
  );
}
