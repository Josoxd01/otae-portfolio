import Link from "next/link";

import type { StudioProfile } from "@/types/portfolio";

interface AboutSectionProps {
  studioProfile: StudioProfile;
}

export function AboutSection({ studioProfile }: AboutSectionProps) {
  return (
    <section id="estudio" className="bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1fr] lg:gap-24">
        <div>
          <p className="section-label">Acerca de OTAE</p>
          <h2 className="mt-8 max-w-xl font-title text-4xl font-medium leading-[1.08] sm:text-5xl">
            Un enfoque integral para cada proyecto
          </h2>
        </div>

        <div className="max-w-2xl pt-1 text-lg leading-9 text-neutral-700">
          <p>{studioProfile.description}</p>
          {studioProfile.mission ? <p className="mt-7">{studioProfile.mission}</p> : null}
          <Link
            href="#contacto"
            className="mt-10 inline-flex items-center gap-3 text-sm font-medium text-neutral-950 transition hover:gap-4"
          >
            Conocer mas sobre nosotros <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
