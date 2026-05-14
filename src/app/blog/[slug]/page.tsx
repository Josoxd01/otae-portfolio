import { BlogDetailPageClient } from "@/components/blog/BlogDetailPageClient";
import { blogs } from "@/data/blogs";
import { getBlogBySlug } from "@/lib/firestore/blogs";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";
import type { Blog } from "@/types/portfolio";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const publishedBlogs = blogs.filter((blog) => blog.status === "published");

export function generateStaticParams() {
  return publishedBlogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const localBlog = publishedBlogs.find((item) => item.slug === slug);
  const firestoreBlog = await getBlogBySlug(slug);
  const blog = firestoreBlog ?? localBlog ?? createPendingBlog(slug);

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
