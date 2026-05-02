"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminTeamMembers } from "@/lib/admin/portfolio-admin";
import type { TeamMember } from "@/types/portfolio";

export function AdminTeamPageClient() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadMembers() {
      try {
        const data = await getAdminTeamMembers();

        if (isMounted) {
          setMembers(data);
        }
      } catch (error) {
        console.warn("Could not load team members.", error);
        setErrorMessage("No se pudo cargar el equipo.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminShell>
      <div>
        <p className="section-label">Admin / Equipo</p>
        <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Equipo</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
          Gestiona las fotografías de los miembros del estudio. La edición completa de perfiles
          puede ampliarse en una siguiente fase.
        </p>
      </div>

      <section className="mt-10 border border-neutral-200 bg-white">
        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando equipo...</p>
        ) : errorMessage ? (
          <p className="p-8 text-sm text-red-600">{errorMessage}</p>
        ) : (
          <div className="divide-y divide-neutral-200">
            {members.map((member) => (
              <article
                key={member.id}
                className="grid gap-5 p-6 sm:grid-cols-[6rem_1fr_auto] sm:items-center"
              >
                <div className="h-24 overflow-hidden border border-neutral-200 bg-neutral-100">
                  {member.photoMedia?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoMedia.url}
                      alt={member.photoMedia.altText ?? member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <h2 className="font-title text-2xl font-medium">{member.name}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{member.role ?? "Sin cargo"}</p>
                </div>
                <Link
                  href={`/admin/team/${member.id}/edit`}
                  className="inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                >
                  Editar foto
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
