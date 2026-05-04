"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type UserProps = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfileForm({ user: initial }: { user: UserProps }) {
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial.name ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [imageUrl, setImageUrl] = useState(initial.image ?? "");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profilePending, setProfilePending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwPending, setPwPending] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  const [avatarPending, setAvatarPending] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    setProfilePending(true);
    try {
      const body: { name: string; email: string; image?: string | null } = {
        name: name.trim(),
        email: email.trim(),
      };
      if (imageUrl.trim() === "") body.image = "";
      else body.image = imageUrl.trim();

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string; user?: { name: string; email: string; image: string | null } };
      if (!res.ok) {
        setProfileError(data.error ?? "Could not save profile.");
        setProfilePending(false);
        return;
      }
      if (data.user) {
        setName(data.user.name);
        setEmail(data.user.email);
        setImageUrl(data.user.image ?? "");
        await update({
          user: {
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
          },
        });
        router.refresh();
        setProfileMessage("Profile saved.");
      }
    } catch {
      setProfileError("Something went wrong.");
    } finally {
      setProfilePending(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwMessage(null);
    setPwPending(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setPwError(data.error ?? "Could not update password.");
        setPwPending(false);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setPwMessage("Password updated.");
    } catch {
      setPwError("Something went wrong.");
    } finally {
      setPwPending(false);
    }
  }

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarError(null);
    setAvatarPending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: fd });
      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok) {
        setAvatarError(data.error ?? "Upload failed.");
        setAvatarPending(false);
        return;
      }
      if (data.url) {
        setImageUrl(data.url);
        await update({
          user: {
            name,
            email,
            image: data.url,
          },
        });
        router.refresh();
      }
    } catch {
      setAvatarError("Something went wrong.");
    } finally {
      setAvatarPending(false);
    }
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteError(null);
    setDeletePending(true);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteError(data.error ?? "Could not delete account.");
        setDeletePending(false);
        return;
      }
      setDeletePassword("");
      await signOut({ callbackUrl: "/" });
    } catch {
      setDeleteError("Something went wrong.");
      setDeletePending(false);
    }
  }

  const initials = (name || email || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-lg space-y-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Photo</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Upload a file (requires Vercel Blob token) or set an image URL below.
        </p>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-lg font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-controlled external URLs
              <img src={imageUrl} alt="" className="h-full w-full object-cover" width={80} height={80} />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onAvatarFile} />
            <button
              type="button"
              disabled={avatarPending}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {avatarPending ? "Uploading…" : "Upload new picture"}
            </button>
            {avatarError ? <p className="text-sm text-red-600 dark:text-red-400">{avatarError}</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <div>
            <label htmlFor="p-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>
          <div>
            <label htmlFor="p-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>
          <div>
            <label htmlFor="p-image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Profile image URL (optional)
            </label>
            <input
              id="p-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <p className="mt-1 text-xs text-zinc-500">Clear the field and save to remove the picture.</p>
          </div>
          {profileError ? <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p> : null}
          {profileMessage ? <p className="text-sm text-green-700 dark:text-green-400">{profileMessage}</p> : null}
          <button
            type="submit"
            disabled={profilePending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {profilePending ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Password</h2>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <div>
            <label htmlFor="cur-pw" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current password
            </label>
            <input
              id="cur-pw"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              New password (min 8 characters)
            </label>
            <input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>
          {pwError ? <p className="text-sm text-red-600 dark:text-red-400">{pwError}</p> : null}
          {pwMessage ? <p className="text-sm text-green-700 dark:text-green-400">{pwMessage}</p> : null}
          <button
            type="submit"
            disabled={pwPending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {pwPending ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">Delete account</h2>
        <p className="mt-1 text-sm text-red-800/90 dark:text-red-300/90">This permanently removes your account and profile. This cannot be undone.</p>
        <form onSubmit={deleteAccount} className="mt-4 space-y-4">
          <div>
            <label htmlFor="del-pw" className="block text-sm font-medium text-red-900 dark:text-red-200">
              Confirm with your password
            </label>
            <input
              id="del-pw"
              type="password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-red-400 focus:ring-2 dark:border-red-800 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>
          {deleteError ? <p className="text-sm text-red-700 dark:text-red-400">{deleteError}</p> : null}
          <button
            type="submit"
            disabled={deletePending}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {deletePending ? "Deleting…" : "Delete my account"}
          </button>
        </form>
      </section>
    </div>
  );
}
