"use client";

import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { auth } from "@/lib/firebase";

export function AdminLoginPageClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16 text-neutral-950">
      <section className="w-full max-w-md border border-neutral-200 bg-white px-7 py-9 sm:px-9">
        <Link
          href="/"
          className="cursor-pointer font-title text-sm font-medium tracking-[0.42em] text-neutral-950"
        >
          OTAE
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Acceso admin
        </p>
        <h1 className="mt-5 font-title text-4xl font-medium leading-tight">
          Ingresar al panel
        </h1>
        <p className="mt-5 text-sm leading-7 text-neutral-600">
          Usa el correo y contraseña autorizados para administrar el contenido del portafolio.
        </p>

        <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Email
            </span>
            <input
              autoComplete="email"
              className="mt-3 w-full border border-neutral-300 bg-white px-4 py-4 text-sm text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Contraseña
            </span>
            <input
              autoComplete="current-password"
              className="mt-3 w-full border border-neutral-300 bg-white px-4 py-4 text-sm text-neutral-950 transition focus:border-neutral-950 focus:outline-none"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage ? (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/invalid-credential") {
      return "Credenciales inválidas. Revisa el correo y la contraseña.";
    }

    if (error.code === "auth/too-many-requests") {
      return "Demasiados intentos. Intenta nuevamente en unos minutos.";
    }
  }

  return "No se pudo iniciar sesión. Intenta nuevamente.";
}
