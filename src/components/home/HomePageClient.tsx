"use client";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { FeaturedProjectsCarousel } from "@/components/home/FeaturedProjectsCarousel";
import { SpecializationAreasSection } from "@/components/home/SpecializationAreasSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useHomeData } from "@/hooks/useHomeData";
import type { HomeData } from "@/lib/firestore/home";

interface HomePageClientProps { initialData: HomeData }

export function HomePageClient({ initialData }: HomePageClientProps) {
  const { homeData } = useHomeData(initialData);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <FeaturedProjectsCarousel projects={homeData.featuredProjects} categories={homeData.projectCategories} />
        <SpecializationAreasSection categories={homeData.projectCategories} projects={homeData.activeProjects} />
        <AboutSection studioProfile={homeData.studioProfile} />
        <ContactCTASection contactChannels={homeData.contactChannels} />
      </main>
      <Footer variant="light" studioProfile={homeData.studioProfile} contactChannels={homeData.contactChannels} />
    </>
  );
}
