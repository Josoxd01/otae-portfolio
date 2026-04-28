import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import {
  getActiveProjectCategories,
  getActiveProjects,
  getContactChannels,
  getStudioProfile,
} from "@/lib/portfolio-data";

export default function ProjectsPage() {
  const projects = getActiveProjects();
  const categories = getActiveProjectCategories();
  const contactChannels = getContactChannels();
  const studioProfile = getStudioProfile();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <ProjectsPageClient projects={projects} categories={categories} />
      </main>
      <Footer studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}
