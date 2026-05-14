"use client";

import { useEffect, useState } from "react";

import type { Blog } from "@/types/portfolio";

export function useBlogPageData(initialBlogs: Blog[]) {
  const [blogs, setBlogs] = useState(initialBlogs);

  useEffect(() => {
    let isMounted = true;

    async function loadBlogs() {
      try {
        const { getPublishedBlogs } = await import("@/lib/firestore/blogs");
        const firestoreBlogs = await getPublishedBlogs();

        if (isMounted) {
          setBlogs(firestoreBlogs);
        }
      } catch (error) {
        console.warn("Firestore Blog data failed. Using local mock fallback.", error);
      }
    }

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return blogs;
}
