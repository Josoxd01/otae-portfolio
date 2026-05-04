import { HomePageClient } from "@/components/home/HomePageClient";
import { getActiveProjectCategories, getActiveProjects, getContactChannels, getFeaturedProjects, getStudioProfile } from "@/lib/portfolio-data";

export default function Home() {
  const initialData = {
    studioProfile: getStudioProfile(),
    activeProjects: getActiveProjects(),
    featuredProjects: getFeaturedProjects(),
    projectCategories: getActiveProjectCategories(),
    contactChannels: getContactChannels(),
  };

  return <HomePageClient initialData={initialData} />;
}
