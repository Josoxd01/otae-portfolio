"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/layout/BrandMark";
import { otaeLogoMedia } from "@/components/layout/brand";
import { auth } from "@/lib/firebase";

const adminLinks = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/studio", label: "Estudio" },
  { href: "/admin/team", label: "Equipo" },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setEmail(user.email ?? "");
      setIsCheckingSession(false);
    });
  }, [router]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut(auth);
    router.replace("/admin/login");
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 text-neutral-950">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Verificando sesión
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white px-6 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-6">
            <Link href="/admin" className="flex h-10 cursor-pointer items-center" aria-label="Ir al inicio del admin OTAE">
              <BrandMark
                logoMedia={otaeLogoMedia}
                imageClassName="h-7 max-w-[7rem]"
                textClassName="font-title text-sm font-medium tracking-[0.42em] text-neutral-950"
              />
            </Link>
            <Link href="/" className="cursor-pointer text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400 transition hover:text-neutral-950">
              Ver sitio
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-pointer border px-4 py-2 transition ${
                    isActive
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {email ? <span className="text-xs text-neutral-500">{email}</span> : null}
            <button
              type="button"
              className="cursor-pointer border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSigningOut}
              onClick={handleSignOut}
            >
              {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">{children}</div>
    </main>
  );
}
