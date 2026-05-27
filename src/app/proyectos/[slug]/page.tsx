import { notFound } from "next/navigation";

import { ProjectDetailPageClient } from "@/components/projects/ProjectDetailPageClient";
import {
  getProjectCategoriesFromFirestore,
  getProjectMediaFromFirestore,
  getProjectBySlugFromFirestore,
} from "@/lib/firestore/projects";
import { getActiveProjectCategories, getActiveProjects, getContactChannels, getProjectBySlug, getProjectMediaByProjectId, getStudioProfile } from "@/lib/portfolio-data";
import type { Project } from "@/types/portfolio";

interface ProjectDetailPageProps { params: Promise<{ slug: string }> }

export const dynamicParams = true;

export function generateStaticParams() {
  return getActiveProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const localProject = getProjectBySlug(slug);
  const localProjectMedia = localProject ? getProjectMediaByProjectId()[localProject.id] ?? [] : [];
  let initialData = {
    categories: getActiveProjectCategories(),
    contactChannels: getContactChannels(),
    project: localProject ?? createPendingProject(slug),
    projectMedia: localProjectMedia,
    studioProfile: getStudioProfile(),
  };
  let shouldRenderNotFound = false;

  try {
    const firestoreProject = await getProjectBySlugFromFirestore(slug);

    if (!firestoreProject) {
      if (!localProject) {
        shouldRenderNotFound = true;
      }
    } else {
      const [categories, projectMedia] = await Promise.all([
        getProjectCategoriesFromFirestore(),
        getProjectMediaFromFirestore(firestoreProject.id),
      ]);

      initialData = {
        categories,
        contactChannels: getContactChannels(),
        project: firestoreProject,
        projectMedia,
        studioProfile: getStudioProfile(),
      };
    }
  } catch (error) {
    console.warn("Firestore Project detail server data failed. Using local/client fallback.", error);
  }

  if (shouldRenderNotFound) {
    notFound();
  }

  return (
    <ProjectDetailPageClient
      slug={slug}
      initialData={initialData}
    />
  );
}

function createPendingProject(slug: string): Project {
  return {
    id: `pending-${slug}`,
    title: "Cargando proyecto",
    slug,
    summary: "",
    description: "",
    categoryIds: [],
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
  };
}
