import { notFound } from "next/navigation";

import { BlogDetailPageClient } from "@/components/blog/BlogDetailPageClient";
import { blogs } from "@/data/blogs";
import { getBlogBySlugFromFirestore } from "@/lib/firestore/blogs";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";
import type { Blog } from "@/types/portfolio";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const publishedBlogs = blogs.filter((blog) => blog.status === "published");

export const dynamicParams = true;

export function generateStaticParams() {
  return publishedBlogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const localBlog = publishedBlogs.find((item) => item.slug === slug);
  let blog = localBlog ?? createPendingBlog(slug);
  let shouldRenderNotFound = false;

  try {
    const firestoreBlog = await getBlogBySlugFromFirestore(slug);

    if (!firestoreBlog) {
      if (!localBlog) {
        shouldRenderNotFound = true;
      }
    } else {
      blog = firestoreBlog;
    }
  } catch (error) {
    console.warn("Firestore Blog detail server data failed. Using local/client fallback.", error);
  }

  if (shouldRenderNotFound) {
    notFound();
  }

  return (
    <BlogDetailPageClient
      contactChannels={getContactChannels()}
      initialBlog={blog}
      slug={slug}
      studioProfile={getStudioProfile()}
    />
  );
}

function createPendingBlog(slug: string): Blog {
  return {
    id: `pending-${slug}`,
    title: "Cargando blog",
    slug,
    content: "",
    categoryIds: [],
    status: "published",
  };
}
