"use client";

import { useEffect, useState } from "react";

import type { Blog } from "@/types/portfolio";

export function useBlogDetailData(slug: string, initialBlog: Blog) {
  const isInitialPlaceholder = initialBlog.id === `pending-${slug}`;
  const [blog, setBlog] = useState<Blog | null>(initialBlog);
  const [isLoading, setIsLoading] = useState(isInitialPlaceholder);

  useEffect(() => {
    let isMounted = true;
    const isPlaceholder = initialBlog.id === `pending-${slug}`;

    async function loadBlog() {
      if (isPlaceholder) {
        setIsLoading(true);
      }

      try {
        const { getBlogBySlug } = await import("@/lib/firestore/blogs");
        const firestoreBlog = await getBlogBySlug(slug);

        if (isMounted) {
          if (firestoreBlog) {
            setBlog(firestoreBlog);
          } else if (isPlaceholder) {
            setBlog(null);
          }
        }
      } catch (error) {
        console.warn("Firestore Blog detail data failed. Using local mock fallback.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [initialBlog.id, slug]);

  return { blog, isLoading };
}
