import { notFound } from "next/navigation";

import { ProjectDetailPageClient } from "@/components/projects/ProjectDetailPageClient";
import { getActiveProjectCategories, getActiveProjects, getContactChannels, getProjectBySlug, getProjectMediaByProjectId, getStudioProfile } from "@/lib/portfolio-data";

interface ProjectDetailPageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getActiveProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailPageClient
      slug={slug}
      initialData={{
        categories: getActiveProjectCategories(),
        contactChannels: getContactChannels(),
        project,
        projectMedia: getProjectMediaByProjectId()[project.id] ?? [],
        studioProfile: getStudioProfile(),
      }}
    />
  );
}
