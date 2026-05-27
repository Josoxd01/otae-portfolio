"use client";

import { useEffect, useState } from "react";

import type {
  ContactChannel,
  Project,
  ProjectCategory,
  ProjectMedia,
  StudioProfile,
} from "@/types/portfolio";

export interface ProjectDetailPageData {
  categories: ProjectCategory[];
  contactChannels: ContactChannel[];
  project: Project;
  projectMedia: ProjectMedia[];
  studioProfile: StudioProfile;
}

export function useProjectDetailData(slug: string, initialData: ProjectDetailPageData) {
  const isInitialPlaceholder = initialData.project.id === `pending-${slug}`;
  const [projectDetailData, setProjectDetailData] = useState<ProjectDetailPageData | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(isInitialPlaceholder);

  useEffect(() => {
    let isMounted = true;
    const isPlaceholder = initialData.project.id === `pending-${slug}`;

    async function loadProjectDetailData() {
      if (isPlaceholder) {
        setIsLoading(true);
      }

      try {
        const {
          getProjectBySlugFromFirestore,
          getProjectCategoriesFromFirestore,
          getProjectMediaFromFirestore,
        } = await import("@/lib/firestore/projects");
        const firestoreProject = await getProjectBySlugFromFirestore(slug);

        if (!firestoreProject) {
          if (isMounted && isPlaceholder) {
            setProjectDetailData(null);
          }
          return;
        }

        const [categories, projectMedia] = await Promise.all([
          getProjectCategoriesFromFirestore(),
          getProjectMediaFromFirestore(firestoreProject.id),
        ]);

        if (isMounted) {
          setProjectDetailData((currentData) => ({
            ...(currentData ?? initialData),
            categories,
            project: firestoreProject,
            projectMedia,
          }));
        }
      } catch (error) {
        console.warn("Firestore Project detail data failed. Using local mock fallback.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjectDetailData();

    return () => {
      isMounted = false;
    };
  }, [initialData, initialData.project.id, slug]);

  return { data: projectDetailData, isLoading };
}
