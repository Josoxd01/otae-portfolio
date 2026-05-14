import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { blogs } from "@/data/blogs";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";

const publishedBlogs = blogs
  .filter((blog) => blog.status === "published")
  .sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? "";
    const secondDate = secondBlog.publishedAt ?? "";

    return secondDate.localeCompare(firstDate);
  });

export default function BlogPage() {
  return (
    <BlogPageClient
      contactChannels={getContactChannels()}
      initialBlogs={publishedBlogs}
      studioProfile={getStudioProfile()}
    />
  );
}
