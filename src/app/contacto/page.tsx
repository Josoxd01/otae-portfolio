import { ContactPageClient } from "@/components/contact/ContactPageClient";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getContactChannels, getStudioProfile } from "@/lib/portfolio-data";

export default function ContactPage() {
  const studioProfile = getStudioProfile();
  const contactChannels = getContactChannels();

  return (
    <>
      <Navbar />
      <ContactPageClient studioProfile={studioProfile} />
      <Footer studioProfile={studioProfile} contactChannels={contactChannels} />
    </>
  );
}
