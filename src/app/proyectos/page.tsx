import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import {
  getActiveProjectCategories,
  getActiveProjects,
  getContactChannels,
  getProjectMediaByProjectId,
  getStudioProfile,
} from "@/lib/portfolio-data";

interface ProjectsPageProps {
  searchParams?: Promise<{
    categoria?: string | string[];
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const projects = getActiveProjects();
  const categories = getActiveProjectCategories();
  const contactChannels = getContactChannels();
  const projectMediaByProjectId = getProjectMediaByProjectId();
  const studioProfile = getStudioProfile();
  const params = await searchParams;
  const categoryQuery = Array.isArray(params?.categoria)
    ? params?.categoria[0]
    : params?.categoria;
  const initialCategoryId =
    categories.find((category) => category.slug === categoryQuery || category.id === categoryQuery)
      ?.id ?? "all";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <ProjectsPageClient
          key={initialCategoryId}
          projects={projects}
          categories={categories}
          initialCategoryId={initialCategoryId}
          projectMediaByProjectId={projectMediaByProjectId}
        />
      </main>
      <Footer variant="dark" studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}
