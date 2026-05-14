import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { blogs as localBlogs } from "@/data/blogs";
import { db } from "@/lib/firebase";
import { removeUndefinedValues } from "@/lib/portfolio-helpers";
import type { Blog, BlogStatus } from "@/types/portfolio";

function sortByPublishedAtDesc(items: Blog[]) {
  return [...items].sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? "";
    const secondDate = secondBlog.publishedAt ?? "";

    return secondDate.localeCompare(firstDate);
  });
}

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    const snapshot = await getDocs(collection(db, "blogs"));

    return sortByPublishedAtDesc(
      snapshot.docs.map((item) => withId(item.id, item.data() as Blog)),
    );
  } catch (error) {
    console.warn("Firestore blogs query failed. Using local mock fallback.", error);
    return sortByPublishedAtDesc(localBlogs);
  }
}

export async function getBlogsByStatus(status: BlogStatus): Promise<Blog[]> {
  try {
    const snapshot = await getDocs(query(collection(db, "blogs"), where("status", "==", status)));

    return sortByPublishedAtDesc(
      snapshot.docs.map((item) => withId(item.id, item.data() as Blog)),
    );
  } catch (error) {
    console.warn(`Firestore blogs query failed for status "${status}". Using local mock fallback.`, error);
    return sortByPublishedAtDesc(localBlogs.filter((blog) => blog.status === status));
  }
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  return getBlogsByStatus("published");
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "blogs"), where("slug", "==", slug), where("status", "==", "published")),
    );
    const blog = snapshot.docs[0];

    return blog ? withId(blog.id, blog.data() as Blog) : null;
  } catch (error) {
    console.warn(`Firestore blog query failed for slug "${slug}". Using local mock fallback.`, error);
    return localBlogs.find((blog) => blog.slug === slug && blog.status === "published") ?? null;
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const snapshot = await getDoc(doc(db, "blogs", id));

  if (!snapshot.exists()) {
    return null;
  }

  return withId(snapshot.id, snapshot.data() as Blog);
}

export async function createBlog(data: Blog): Promise<void> {
  const now = new Date().toISOString();
  const publishedAt = data.status === "published" ? data.publishedAt || now : data.publishedAt;

  await setDoc(
    doc(db, "blogs", data.id),
    removeUndefinedValues({
      ...data,
      publishedAt,
      createdAt: data.createdAt ?? now,
      updatedAt: now,
    }),
  );
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<void> {
  await setDoc(
    doc(db, "blogs", id),
    removeUndefinedValues({
      ...data,
      updatedAt: new Date().toISOString(),
    }),
    { merge: true },
  );
}

export async function updateBlogStatus(id: string, status: BlogStatus): Promise<void> {
  const currentBlog = await getBlogById(id);
  const now = new Date().toISOString();

  await updateDoc(
    doc(db, "blogs", id),
    removeUndefinedValues({
      status,
      updatedAt: now,
      publishedAt: status === "published" ? currentBlog?.publishedAt ?? now : currentBlog?.publishedAt,
    }),
  );
}

export async function publishBlog(id: string): Promise<void> {
  await updateBlogStatus(id, "published");
}

export async function hideBlog(id: string): Promise<void> {
  await updateBlogStatus(id, "hidden");
}
