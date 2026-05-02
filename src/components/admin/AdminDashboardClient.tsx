"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";

const modules = [
  {
    description: "Crear, editar, destacar y ordenar obras del portafolio.",
    href: "/admin/projects",
    label: "Gestionar proyectos",
    title: "Proyectos",
  },
  {
    description: "Administrar áreas de especialización, tipologías y contenido editorial.",
    href: "/admin/categories",
    label: "Gestionar categorías",
    title: "Categorías",
  },
  {
    description: "Editar textos institucionales, imágenes del estudio y datos generales.",
    href: "/admin/studio",
    label: "Gestionar estudio",
    title: "Estudio",
  },
  {
    description: "Mantener email, WhatsApp, redes, dirección y horarios actualizados.",
    href: "/admin",
    label: "Próximamente",
    title: "Contacto",
  },
  {
    description: "Actualizar miembros, cargos, biografías y enlaces profesionales.",
    href: "/admin/team",
    label: "Gestionar equipo",
    title: "Equipo",
  },
];

export function AdminDashboardClient() {
  return (
    <AdminShell>
      <section>
        <p className="section-label">Admin</p>
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-title text-4xl font-medium leading-tight sm:text-5xl">
              Panel de administración
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600">
              Gestiona el contenido principal del portafolio OTAE desde una interfaz simple,
              clara y preparada para crecer hacia el CMS completo.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <article key={module.title} className="border border-neutral-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Módulo
            </p>
            <h2 className="mt-5 font-title text-3xl font-medium">{module.title}</h2>
            <p className="mt-5 min-h-20 text-sm leading-7 text-neutral-600">
              {module.description}
            </p>
            <Link
              href={module.href}
              className={`mt-8 inline-flex items-center gap-3 text-sm font-semibold transition ${
                module.label === "Próximamente"
                  ? "pointer-events-none text-neutral-400"
                  : "text-neutral-950 hover:gap-4"
              }`}
            >
              {module.label} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
