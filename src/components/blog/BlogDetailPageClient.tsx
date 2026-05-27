"use client";

import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { projectCategories } from "@/data/project-categories";
import { projects } from "@/data/projects";
import { useBlogDetailData } from "@/hooks/useBlogDetailData";
import type { Blog, ContactChannel, Project, ProjectCategory, StudioProfile } from "@/types/portfolio";

interface BlogDetailPageClientProps {
  contactChannels: ContactChannel[];
  initialBlog: Blog;
  slug: string;
  studioProfile: StudioProfile;
}

const categoryById = new Map(projectCategories.map((category) => [category.id, category]));

export function BlogDetailPageClient({
  contactChannels,
  initialBlog,
  slug,
  studioProfile,
}: BlogDetailPageClientProps) {
  const { blog, isLoading } = useBlogDetailData(slug, initialBlog);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Blog</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              Cargando publicacion
            </h1>
          </div>
        </main>
        <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Blog</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              No encontramos esta publicacion
            </h1>
            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
            >
              &larr; Volver a Blogs
            </Link>
          </div>
        </main>
        <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
      </>
    );
  }

  const categories = getBlogCategories(blog);
  const relatedSections = getRelatedProjectSections(categories);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <article>
          <header className="px-6 pb-10 pt-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-24">
            <div className="mx-auto max-w-7xl">
              <h1 className="max-w-6xl font-title text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>
              {blog.subtitle ? (
                <p className="mt-6 max-w-5xl text-lg leading-9 text-neutral-600">
                  {blog.subtitle}
                </p>
              ) : null}
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
                {formatDate(blog.publishedAt)}
              </p>
            </div>
          </header>

          <section className="px-6 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="relative min-h-[300px] overflow-hidden bg-neutral-200 sm:min-h-[460px] lg:min-h-[620px]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
                {blog.coverMedia ? (
                  <Image
                    src={blog.coverMedia.url}
                    alt={blog.coverMedia.altText ?? blog.title}
                    fill
                    priority
                    sizes="100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </div>
          </section>

          <section className="px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
            <div className="mx-auto max-w-3xl space-y-7 text-lg leading-9 text-neutral-700">
              {getContentParagraphs(blog.content).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </article>

        {relatedSections.length > 0 ? (
          <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              {relatedSections.map((section) => (
                <RelatedProjectsSection
                  key={section.category.id}
                  category={section.category}
                  projects={section.projects}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="px-6 pb-16 sm:px-8 lg:px-12 lg:pb-24">
          <div className="mx-auto max-w-7xl border-t border-neutral-200 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-sm font-semibold text-neutral-950 transition hover:gap-4"
            >
              &larr; Volver a Blogs
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}

function RelatedProjectsSection({
  category,
  projects: relatedProjects,
}: {
  category: ProjectCategory;
  projects: Project[];
}) {
  return (
    <div className="border-b border-neutral-200 py-16 last:border-b-0 lg:py-24">
      <div className="text-center">
        <h2 className="font-title text-3xl font-medium text-neutral-950 sm:text-4xl">
          {category.name}
        </h2>
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
        Proyectos relacionados
      </p>

      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {relatedProjects.map((project, index) => (
          <RelatedProjectCard
            key={project.id}
            project={project}
            variant={index === 0 ? "wide" : "compact"}
          />
        ))}
      </div>
    </div>
  );
}

function RelatedProjectCard({
  project,
  variant,
}: {
  project: Project;
  variant: "compact" | "wide";
}) {
  const titleClassName =
    variant === "wide"
      ? "mt-5 font-title text-3xl font-medium leading-tight text-neutral-950 sm:text-4xl"
      : "mt-4 font-title text-2xl font-medium leading-tight text-neutral-950";
  const projectHref = `/proyectos/${project.slug}`;

  return (
    <article className="group">
      <Link href={projectHref} className="relative block h-72 overflow-hidden bg-neutral-200 lg:h-[22rem]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
        {project.coverMedia ? (
          <Image
            src={project.coverMedia.url}
            alt={project.coverMedia.altText ?? project.title}
            fill
            sizes={variant === "wide" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          />
        ) : null}
        <div className="absolute inset-0 hidden bg-neutral-950/70 p-6 text-white opacity-0 transition duration-300 group-hover:opacity-100 lg:flex lg:flex-col lg:justify-end">
          <p className="text-sm leading-7 text-white/86">
            {getProjectExcerpt(project)}
          </p>
          <span className="mt-5 inline-flex text-sm font-semibold">
            Leer más <span aria-hidden="true" className="ml-2">-&gt;</span>
          </span>
        </div>
      </Link>
      <h3 className={titleClassName}>{project.title}</h3>
      {[project.location, project.year].filter(Boolean).length > 0 ? (
        <p className="mt-2 text-sm text-neutral-500">
          {[project.location, project.year].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </article>
  );
}

function getBlogCategories(blog: Blog) {
  return blog.categoryIds
    .map((categoryId) => categoryById.get(categoryId))
    .filter((category): category is ProjectCategory => Boolean(category));
}

function getRelatedProjectSections(categories: ProjectCategory[]) {
  const activeProjects = projects.filter((project) => project.isActive);

  return categories
    .map((category) => {
      const relatedProjects = activeProjects
        .filter(
          (project) =>
            project.primaryCategoryId === category.id || project.categoryIds.includes(category.id),
        )
        .sort((firstProject, secondProject) => firstProject.sortOrder - secondProject.sortOrder)
        .slice(0, 3);

      return { category, projects: relatedProjects };
    })
    .filter((section) => section.projects.length > 0);
}

function getContentParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getProjectExcerpt(project: Project) {
  const text = project.summary || project.description;

  if (text.length <= 150) {
    return text;
  }

  return `${text.slice(0, 150).trimEnd()}...`;
}

function formatDate(value?: string) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
