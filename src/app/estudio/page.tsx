import { StudioPageClient } from "@/components/studio/StudioPageClient";
import { getContactChannels, getStudioProfile, getTeamMembers } from "@/lib/portfolio-data";

export default function StudioPage() {
  return (
    <StudioPageClient
      initialData={{
        contactChannels: getContactChannels(),
        studioProfile: getStudioProfile(),
        teamMembers: getTeamMembers(),
      }}
    />
  );
}
