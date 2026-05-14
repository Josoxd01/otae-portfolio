"use client";

import {
  ArrowUpRight,
  Building2,
  FolderKanban,
  Newspaper,
  Tags,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminBlogs,
  getAdminCategories,
  getAdminProjects,
  getAdminTeamMembers,
} from "@/lib/admin/portfolio-admin";

type CountKey = "blogs" | "categories" | "projects" | "team";

interface DashboardModule {
  countKey?: CountKey;
  description: string;
  href?: string;
  icon: LucideIcon;
  meta: string;
  title: string;
}

const modules: DashboardModule[] = [
  {
    countKey: "projects",
    description: "Obras, portadas, galerias, planos, estados y orden editorial.",
    href: "/admin/projects",
    icon: FolderKanban,
    meta: "proyectos",
    title: "Proyectos",
  },
  {
    countKey: "categories",
    description: "Areas, tipologias y filtros que organizan el portafolio.",
    href: "/admin/categories",
    icon: Tags,
    meta: "categorias",
    title: "Categorias",
  },
  {
    countKey: "blogs",
    description: "Publicaciones editoriales, estados, portadas y categorias relacionadas.",
    href: "/admin/blogs",
    icon: Newspaper,
    meta: "blogs",
    title: "Blogs",
  },
  {
    description: "Textos, imagenes institucionales y datos generales del estudio.",
    href: "/admin/studio",
    icon: Building2,
    meta: "1 perfil",
    title: "Estudio",
  },
  {
    countKey: "team",
    description: "Miembros, cargos, biografias, enlaces y orden de aparicion.",
    href: "/admin/team",
    icon: UsersRound,
    meta: "miembros",
    title: "Equipo",
  },
];

interface DashboardCounts {
  blogs?: number;
  categories?: number;
  projects?: number;
  team?: number;
}

export function AdminDashboardClient() {
  return (
    <AdminShell>
      <DashboardContent />
    </AdminShell>
  );
}

function DashboardContent() {
  const [counts, setCounts] = useState<DashboardCounts>({});
  const [countsStatus, setCountsStatus] = useState<"error" | "loading" | "ready">("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadCounts() {
      try {
        const [projects, categories, blogs, teamMembers] = await Promise.all([
          getAdminProjects(),
          getAdminCategories(),
          getAdminBlogs(),
          getAdminTeamMembers(),
        ]);

        if (!isMounted) {
          return;
        }

        setCounts({
          blogs: blogs.length,
          categories: categories.length,
          projects: projects.length,
          team: teamMembers.length,
        });
        setCountsStatus("ready");
      } catch (error) {
        console.warn("Could not load dashboard counts.", error);
        if (isMounted) {
          setCountsStatus("error");
        }
      }
    }

    loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section>
        <p className="section-label">Admin</p>
        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-title text-4xl font-medium leading-tight sm:text-5xl">
              Panel de administracion
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600">
              Gestiona el contenido principal del portafolio OTAE desde el panel de administracion.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {modules.map((module) => (
          <DashboardModuleCard
            key={module.title}
            module={module}
            countLabel={getCountLabel(module, counts, countsStatus)}
          />
        ))}
      </section>
    </>
  );
}

function DashboardModuleCard({
  countLabel,
  module,
}: {
  countLabel: string;
  module: DashboardModule;
}) {
  const Icon = module.icon;
  const cardClassName = "group relative flex min-h-[260px] cursor-pointer flex-col justify-between overflow-hidden border border-neutral-200 bg-white p-6 text-left transition duration-300 hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50";

  const content = (
    <>
      <div>
        <div className="flex items-start justify-between gap-5">
          <span className="flex h-14 w-14 items-center justify-center border border-neutral-200 bg-neutral-50 text-neutral-950 transition group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
            <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <span
            className={`inline-flex items-center border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${"border-neutral-200 text-neutral-500 group-hover:border-neutral-950 group-hover:text-neutral-950"
              }`}
          >
            {countLabel}
          </span>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
          Modulo
        </p>
        <h2 className="mt-4 font-title text-3xl font-medium leading-tight">{module.title}</h2>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{module.description}</p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Abrir modulo
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center border border-neutral-200 text-neutral-950 transition group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white"
        >
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
    </>
  );

  return (
    <Link href={module.href ?? "/admin"} className={cardClassName} aria-label={`Abrir modulo ${module.title}`}>
      {content}
    </Link>
  );
}

function getCountLabel(
  module: DashboardModule,
  counts: DashboardCounts,
  countsStatus: "error" | "loading" | "ready",
) {
  if (!module.countKey) {
    return module.meta;
  }

  if (countsStatus === "loading") {
    return "Cargando";
  }

  if (countsStatus === "error") {
    return "No disponible";
  }

  const count = counts[module.countKey] ?? 0;

  return `${count} ${module.meta}`;
}
