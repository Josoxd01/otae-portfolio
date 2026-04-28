import type { ContactChannel } from "@/types/portfolio";

interface ContactCTASectionProps {
  contactChannels: ContactChannel[];
}

export function ContactCTASection({ contactChannels }: ContactCTASectionProps) {
  const primaryChannel =
    contactChannels.find((channel) => channel.type === "whatsapp" && channel.isPrimary) ??
    contactChannels.find((channel) => channel.type === "email") ??
    contactChannels.find((channel) => channel.isPrimary) ??
    contactChannels[0];

  return (
    <section id="contacto" className="bg-white px-0 py-20 sm:px-6 lg:px-0">
      <div className="bg-neutral-950 px-6 py-24 text-center text-white sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-title text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-white/78 sm:text-lg">
            Nos encantaria conocer tu vision y explorar como podemos ayudarte a hacerla realidad.
          </p>
          {primaryChannel ? (
            <a
              href={primaryChannel.url ?? "#"}
              className="mt-12 inline-flex items-center gap-4 bg-white px-8 py-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
              target={primaryChannel.type === "email" ? undefined : "_blank"}
              rel={primaryChannel.type === "email" ? undefined : "noreferrer"}
            >
              Iniciar conversacion <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
