export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-stone-700/60 pb-6 text-sm uppercase tracking-[0.2em] text-stone-400">
          <span>Po-OTAE</span>
          <span>Arquitectura</span>
        </header>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
              Portafolio administrable
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-balance sm:text-6xl lg:text-7xl">
              Una base digital premium para proyectos arquitectonicos.
            </h1>
          </div>

          <div className="border-l border-stone-700/70 pl-6 text-base leading-8 text-stone-300">
            <p>
              Este proyecto inicia el portafolio web de Po-OTAE: una experiencia
              visual sobria para presentar obras, categorias, filtros, detalle de
              proyectos y contacto. El panel admin y Firebase llegaran en fases
              posteriores.
            </p>
          </div>
        </div>

        <footer className="grid gap-4 border-t border-stone-700/60 pt-6 text-sm text-stone-400 sm:grid-cols-3">
          <span>Next.js</span>
          <span>TypeScript</span>
          <span>Tailwind CSS</span>
        </footer>
      </section>
    </main>
  );
}
