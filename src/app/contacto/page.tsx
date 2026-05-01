import { ContactPageClient } from "@/components/contact/ContactPageClient";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";

export default function ContactPage() {
  return (
    <ContactPageClient
      initialData={{
        contactChannels: getContactChannels(),
        studioProfile: getStudioProfile(),
      }}
    />
  );
}
