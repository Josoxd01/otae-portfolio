import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { FeaturedProjectsCarousel } from "@/components/home/FeaturedProjectsCarousel";
import { SpecializationAreasSection } from "@/components/home/SpecializationAreasSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  getActiveProjectCategories,
  getActiveProjects,
  getContactChannels,
  getFeaturedProjects,
  getStudioProfile,
} from "@/lib/portfolio-data";

export default function Home() {
  const studioProfile = getStudioProfile();
  const activeProjects = getActiveProjects();
  const featuredProjects = getFeaturedProjects();
  const projectCategories = getActiveProjectCategories();
  const contactChannels = getContactChannels();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <FeaturedProjectsCarousel projects={featuredProjects} categories={projectCategories} />
        <AboutSection studioProfile={studioProfile} />
        <SpecializationAreasSection categories={projectCategories} projects={activeProjects} />
        <ContactCTASection contactChannels={contactChannels} />
      </main>
      <Footer studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}
