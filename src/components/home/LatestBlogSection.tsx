"use client";

import Image from "next/image";
import Link from "next/link";

import { blogs } from "@/data/blogs";
import { projectCategories } from "@/data/project-categories";
import type { Blog, ProjectCategory } from "@/types/portfolio";

const categoryById = new Map(projectCategories.map((category) => [category.id, category]));
const readMoreLabel = "Leer más";

const latestBlog = blogs
  .filter((blog) => blog.status === "published")
  .sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? "";
    const secondDate = secondBlog.publishedAt ?? "";

    return secondDate.localeCompare(firstDate);
  })[0];

export function LatestBlogSection() {
  if (!latestBlog) {
    return null;
  }

  const categories = getBlogCategories(latestBlog);
  const blogHref = `/blog/${latestBlog.slug}`;

  return (
    <section className="bg-neutral-800 px-6 py-14 text-white sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/52">
          Último blog
        </p>

        <article className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <Link
            href={blogHref}
            className="group relative block min-h-[250px] overflow-hidden bg-neutral-700 sm:min-h-[330px] lg:min-h-[380px]"
            aria-label={`${readMoreLabel} sobre ${latestBlog.title}`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
            {latestBlog.coverMedia ? (
              <Image
                src={latestBlog.coverMedia.url}
                alt={latestBlog.coverMedia.altText ?? latestBlog.title}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}
          </Link>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/52">
              {formatDate(latestBlog.publishedAt)}
            </p>
            <h2 className="mt-5 font-title text-3xl font-medium leading-tight sm:text-4xl">
              {latestBlog.title}
            </h2>
            {latestBlog.subtitle ? (
              <p className="mt-5 max-w-xl text-base leading-8 text-white/76">
                {latestBlog.subtitle}
              </p>
            ) : null}
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
              {getExcerpt(latestBlog.content, 170)}{" "}
              <Link
                href={blogHref}
                className="font-semibold text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
              >
                {readMoreLabel}
              </Link>
            </p>
            <CategoryPills categories={categories} />
          </div>
        </article>
      </div>
    </section>
  );
}

function CategoryPills({ categories }: { categories: ProjectCategory[] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {categories.map((category) => (
        <span
          key={category.id}
          className="border border-white/24 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/68"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}

function getBlogCategories(blog: Blog) {
  return blog.categoryIds
    .map((categoryId) => categoryById.get(categoryId))
    .filter((category): category is ProjectCategory => Boolean(category));
}

function getExcerpt(content: string, maxLength: number) {
  const firstParagraph = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean) ?? "";

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return `${firstParagraph.slice(0, maxLength).trimEnd()}...`;
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
