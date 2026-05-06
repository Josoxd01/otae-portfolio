import { notFound } from "next/navigation";

const demoImageUrl = "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1600&q=80";

export default function DevStylesPage() {
  notFound();
}

function StylesPlayground() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-neutral-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Pagina temporal de pruebas. No incluir en entrega final.
        </p>

        <header className="mt-10 border-b border-neutral-200 pb-8">
          <p className="section-label">Dev / Styles</p>
          <h1 className="mt-5 font-title text-5xl font-medium leading-tight">Playground de estilos</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Comparaciones visuales simples para entender clases Tailwind usadas en heroes, overlays,
            posicionamiento, imagenes y fuentes del proyecto.
          </p>
        </header>

        <PlaygroundSection title="A. Alturas del hero">
          <div className="grid gap-5 lg:grid-cols-3">
            <HeroHeightExample label="h-[360px]" className="h-[360px]" />
            <HeroHeightExample label="h-[640px]" className="h-[640px]" />
            <HeroHeightExample label="min-h-[calc(100svh-68px)]" className="min-h-[calc(100svh-68px)]" />
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="B. Posicionamiento">
          <div className="relative min-h-[360px] overflow-hidden border border-neutral-200 bg-neutral-100">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#e5e5e5,#a3a3a3_45%,#171717)]" />
            <div className="absolute left-5 top-5 border border-white/50 bg-black/55 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              absolute inset-0 ocupa todo el contenedor
            </div>
            <div className="relative z-10 flex min-h-[360px] items-center justify-center p-8 text-center text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">relative define el contexto</p>
                <h2 className="mt-5 font-title text-4xl font-medium">z-10 queda encima</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
                  El contenedor padre usa <code>relative</code>, el fondo usa <code>absolute inset-0</code> y este texto queda encima con <code>relative z-10</code>.
                </p>
              </div>
            </div>
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="C. Imagen object-cover vs object-contain">
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageFitCard fitClass="object-cover" label="object-cover" />
            <ImageFitCard fitClass="object-contain" label="object-contain" />
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="D. Imagen pequena simulada">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <div className="min-h-[320px] border border-neutral-200 bg-[linear-gradient(90deg,#d4d4d4_25%,transparent_25%,transparent_75%,#d4d4d4_75%),linear-gradient(90deg,#d4d4d4_25%,transparent_25%,transparent_75%,#d4d4d4_75%)] bg-[length:82px_82px] bg-[position:0_0,21px_21px]" />
            <div className="flex items-center justify-center border border-neutral-200 p-6">
              <div className="max-w-md">
                <p className="section-label">Simulacion</p>
                <h3 className="mt-5 font-title text-3xl font-medium">Imagen pequena estirada</h3>
                <p className="mt-5 text-sm leading-7 text-neutral-600">
                  Una imagen pequena se estira y puede verse pixelada si se usa como portada. Este patron exagera ese efecto para hacerlo evidente.
                </p>
              </div>
            </div>
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="E. Overlay / gradiente">
          <div className="grid gap-5 lg:grid-cols-3">
            <OverlayCard label="Sin overlay" />
            <OverlayCard label="Overlay muy suave" overlayClass="bg-gradient-to-t from-black/100 via-black/10 to-transparent" />
            <OverlayCard label="Overlay fuerte" overlayClass="bg-gradient-to-b from-black/100 via-black/60  to-black/30" />
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="E. Overlay / gradiente">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="relative min-h-[320px] overflow-hidden border border-neutral-200">
              <div className="absolute inset-0 bg-white" />

              <div className="relative z-10 flex min-h-[320px] items-end p-6 text-white">
                <div>
                  <p className="section-label text-white/80">Sin overlay</p>
                  <h3 className="mt-5 font-title text-3xl font-medium">Imagen base</h3>
                  <p className="mt-5 text-sm leading-7 text-white/80">
                    Aqui no hay ninguna capa adicional encima del fondo.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden border border-neutral-200">
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to/black/20" />
              <div className="relative z-10 flex min-h-[320px] items-end p-6 text-white">
                <div>
                  <p className="section-label text-white/80">Overlay suave</p>
                  <h3 className="mt-5 font-title text-3xl font-medium">Gradiente suave</h3>
                  <p className="mt-5 text-sm leading-7 text-white/80">
                    Aqui si hay una capa oscura suave para mejorar la lectura del texto.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden border border-neutral-200">
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              <div className="relative z-10 flex min-h-[320px] items-end p-6 text-white">
                <div>
                  <p className="section-label text-white/80">Overlay fuerte</p>
                  <h3 className="mt-5 font-title text-3xl font-medium">Gradiente fuerte</h3>
                  <p className="mt-5 text-sm leading-7 text-white/80">
                    Aqui la capa oscura es mas intensa, por eso el texto resalta mas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="F. Hover zoom">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="group h-[420px] overflow-hidden border border-neutral-200 bg-neutral-100 cur">
              <img src={demoImageUrl} alt="Casa contemporanea para prueba de hover zoom" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
            </div>
            <div className="border border-neutral-200 p-6">
              <p className="section-label">group + overflow-hidden</p>
              <h3 className="mt-5 font-title text-3xl font-medium">El zoom queda dentro del marco</h3>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                La imagen usa <code>group-hover:scale-[1.05] transition duration-700</code>. El contenedor usa <code>overflow-hidden</code> para que el zoom no se salga.
              </p>
            </div>
          </div>
        </PlaygroundSection>

        <PlaygroundSection title="G. Fuentes">
          <div className="grid gap-5 lg:grid-cols-2">
            <FontCard title="font-sans" className="font-sans" description="font-sans usa la fuente base del sitio" />
            <FontCard title="font-title" className="font-title" description="font-title usa la fuente de titulos" />
          </div>
        </PlaygroundSection>
      </div>
    </main>
  );
}

function PlaygroundSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="border-b border-neutral-200 py-10">
      <h2 className="font-title text-3xl font-medium">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function HeroHeightExample({ className, label }: { className: string; label: string }) {
  return (
    <div className={`relative overflow-hidden border border-neutral-200 bg-neutral-100 ${className}`}>
      <img src={demoImageUrl} alt={`Bloque de prueba ${label}`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 flex h-full items-end p-5 text-white">
        <span className="bg-neutral-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
    </div>
  );
}

function ImageFitCard({ fitClass, label }: { fitClass: "object-cover" | "object-contain"; label: string }) {
  return (
    <article className="border border-neutral-200 p-4">
      <div className="flex h-[340px] items-center justify-center overflow-hidden bg-neutral-100">
        <img src={demoImageUrl} alt={`Prueba ${label}`} className={`h-full w-full ${fitClass}`} />
      </div>
      <p className="mt-4 text-sm font-semibold text-neutral-950">{label}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-500">
        {fitClass === "object-cover" ? "Rellena todo el contenedor y puede recortar bordes." : "Muestra la imagen completa y puede dejar espacio vacio."}
      </p>
    </article>
  );
}

function OverlayCard({ label, overlayClass }: { label: string; overlayClass?: string }) {
  return (
    <article className="relative h-[320px] overflow-hidden border border-neutral-200 bg-neutral-100">
      <img src={demoImageUrl} alt={`Prueba de overlay: ${label}`} className="absolute inset-0 h-full w-full object-cover" />
      {overlayClass ? <div className={`absolute inset-0 ${overlayClass}`} /> : null}
      <div className="relative z-10 flex h-full items-end p-5 text-white">
        <span className="bg-neutral-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
    </article>
  );
}

function FontCard({ className, description, title }: { className: string; description: string; title: string }) {
  return (
    <article className={`border border-neutral-200 p-6 ${className}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-400">{title}</p>
      <h3 className="mt-5 text-4xl font-medium leading-tight">Arquitectura con intencion</h3>
      <p className="mt-4 text-xl">Subtitulo editorial para comparar ritmo visual.</p>
      <p className="mt-5 text-sm leading-7 text-neutral-600">{description}. Este parrafo permite comparar lectura, peso y textura tipografica dentro del mismo sistema visual.</p>
    </article>
  );
}
