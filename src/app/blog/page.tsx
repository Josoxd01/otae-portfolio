import Image from "next/image";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { blogs } from "@/data/blogs";
import { projectCategories } from "@/data/project-categories";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";
import type { Blog, ProjectCategory } from "@/types/portfolio";

const publishedBlogs = blogs
  .filter((blog) => blog.status === "published")
  .sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? "";
    const secondDate = secondBlog.publishedAt ?? "";

    return secondDate.localeCompare(firstDate);
  });

const categoryById = new Map(projectCategories.map((category) => [category.id, category]));
const featuredBlog = publishedBlogs[0];
const secondaryBlogs = publishedBlogs.slice(1);
const readMoreLabel = "Leer más";

export default function BlogPage() {
  const contactChannels = getContactChannels();
  const studioProfile = getStudioProfile();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        {featuredBlog ? <FeaturedBlogArticle blog={featuredBlog} /> : null}

        {secondaryBlogs.length > 0 ? (
          <section className="px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {secondaryBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}

function FeaturedBlogArticle({ blog }: { blog: Blog }) {
  const categories = getBlogCategories(blog);
  const blogHref = `/blog/${blog.slug}`;

  return (
    <section className="bg-neutral-800 px-6 py-8 text-white sm:px-8 lg:px-12 lg:py-12">
      <article
        id={blog.slug}
        className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12"
      >
        <a
          href={blogHref}
          className="group relative block min-h-[280px] overflow-hidden bg-neutral-700 sm:min-h-[360px] lg:min-h-[440px]"
          aria-label={`${readMoreLabel} sobre ${blog.title}`}
        >
          <BlogImage blog={blog} priority sizes="(min-width: 1024px) 58vw, 100vw" />
        </a>

        <div className="flex flex-col justify-center py-2 lg:py-6">
          <BlogMeta publishedAt={blog.publishedAt} tone="dark" />
          <h1 className="mt-5 font-title text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem]">
            {blog.title}
          </h1>
          {blog.subtitle ? (
            <p className="mt-5 max-w-xl text-base leading-8 text-white/76">
              {blog.subtitle}
            </p>
          ) : null}
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
            {getExcerpt(blog.content, 175)}{" "}
            <a
              href={blogHref}
              className="font-semibold text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
            >
              {readMoreLabel}
            </a>
          </p>
          <CategoryPills categories={categories} className="mt-7" tone="dark" />
        </div>
      </article>
    </section>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  const categories = getBlogCategories(blog);
  const blogHref = `/blog/${blog.slug}`;

  return (
    <article id={blog.slug} className="group">
      <a
        href={blogHref}
        className="relative block aspect-[1.08/1] overflow-hidden bg-neutral-200"
        aria-label={`Leer mas sobre ${blog.title}`}
      >
        <BlogImage blog={blog} sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 100vw" />
        <div className="pointer-events-none absolute inset-0 hidden bg-neutral-950/78 p-6 text-white opacity-0 transition duration-300 group-hover:opacity-100 md:flex md:flex-col md:justify-end">
          <p className="text-sm leading-7 text-white/86">{getExcerpt(blog.content, 150)}</p>
          <span className="mt-5 inline-flex text-sm font-semibold">
            {readMoreLabel} <span aria-hidden="true" className="ml-2">-&gt;</span>
          </span>
        </div>
      </a>

      <div className="mt-5">
        <BlogMeta publishedAt={blog.publishedAt} />
        <h2 className="mt-3 font-title text-2xl font-medium leading-tight">{blog.title}</h2>
        {blog.subtitle ? (
          <p className="mt-3 text-sm leading-7 text-neutral-600">{blog.subtitle}</p>
        ) : null}
        <CategoryPills categories={categories} className="mt-5" />
      </div>
    </article>
  );
}

function BlogImage({
  blog,
  priority = false,
  sizes,
}: {
  blog: Blog;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#efede8,#b7b9af_48%,#262626)]" />
      {blog.coverMedia ? (
        <Image
          src={blog.coverMedia.url}
          alt={blog.coverMedia.altText ?? blog.title}
          fill
          priority={priority}
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
        />
      ) : null}
    </>
  );
}

function BlogMeta({
  publishedAt,
  tone = "light",
}: {
  publishedAt?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.28em] ${
        tone === "dark" ? "text-white/52" : "text-neutral-400"
      }`}
    >
      {formatDate(publishedAt)}
    </p>
  );
}

function CategoryPills({
  categories,
  className = "",
  tone = "light",
}: {
  categories: ProjectCategory[];
  className?: string;
  tone?: "dark" | "light";
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <span
          key={category.id}
          className={`border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
            tone === "dark"
              ? "border-white/24 text-white/68"
              : "border-neutral-300 text-neutral-500"
          }`}
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
