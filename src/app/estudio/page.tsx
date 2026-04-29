import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { StudioPageClient } from "@/components/studio/StudioPageClient";
import { getContactChannels, getStudioProfile, getTeamMembers } from "@/lib/portfolio-data";

export default function StudioPage() {
  const studioProfile = getStudioProfile();
  const teamMembers = getTeamMembers();
  const contactChannels = getContactChannels();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-neutral-950">
        <StudioPageClient studioProfile={studioProfile} teamMembers={teamMembers} />
      </main>
      <Footer studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}
