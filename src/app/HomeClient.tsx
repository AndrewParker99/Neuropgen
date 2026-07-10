"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useCms } from "@/components/CmsProvider";

const cardLinks: Record<string, string> = {
  enfermedades: "/enfermedades",
  psicoeducacion: "/psicoeducacion",
  recursos: "/recursos",
  "grupo-apoyo": "/grupo-apoyo",
};

export function HomeClient() {
  const { site } = useCms();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <SiteHeader />

        <main className="grid items-center gap-8 py-10 lg:grid-cols-[1.15fr_1fr]">

          {/* ── Hero card ── */}
          <section className="glass rounded-[32px] p-8 sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-bold tracking-wide text-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Un refugio para familias extraordinarias
            </span>

            <h1 className="mt-7 text-[clamp(44px,7vw,70px)] font-black leading-[0.93] tracking-tight text-white">
              Neuro<span className="text-green-400">pGen</span>
            </h1>

            <h2 className="mt-4 text-[clamp(17px,2.2vw,24px)] font-semibold leading-snug text-white/70">
              Conectando la genética, el neurodesarrollo y las familias.
            </h2>

            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-white/55">
              NeuropGen acerca información confiable, clara y humana sobre genética y
              neuropsicología a pacientes, familias y profesionales de salud.
            </p>

            <blockquote className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-[15px] font-medium leading-relaxed text-white/80">
              <span className="mb-1 block text-2xl leading-none text-green-400/50">&ldquo;</span>
              Cuando llega un diagnóstico, también puede empezar un camino acompañado,
              con palabras simples y pasos posibles.
              <span className="block text-right text-2xl leading-none text-green-400/50">&rdquo;</span>
            </blockquote>
          </section>

          {/* ── Módulos ── */}
          <section aria-label="Módulos principales" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {site.sections.map((section) => (
              <article
                key={section.id}
                className="glass glass-hover flex min-h-[268px] flex-col justify-between rounded-[28px] p-6"
              >
                <div>
                  <span className="grid h-[50px] w-[50px] place-items-center rounded-2xl border border-white/10 bg-white/08 text-[22px]"
                    style={{ background: "rgba(255,255,255,0.08)" }}>
                    {section.icon}
                  </span>
                  <h3 className="mt-5 text-[19px] font-extrabold leading-tight text-white">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/55">
                    {section.summary}
                  </p>
                </div>

                <Link
                  href={cardLinks[section.id] || "/"}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-[14px] font-bold text-white shadow-lg shadow-green-900/40 transition-colors duration-200 hover:bg-green-400"
                >
                  Acceder
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </article>
            ))}
          </section>
        </main>

        <footer className="mb-4 rounded-2xl border border-white/08 bg-white/[0.04] px-6 py-5 text-center text-[13px] leading-relaxed text-white/40"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          Neuropsicólogo Andrés Escalera Páez · Dra. Belen Prieto Corona · Dra. Sulema Rojas · Dra. Julieta Moreno · Dr. Edgar Ricardez
          <br />
          <span className="text-white/25">© {new Date().getFullYear()} Neurapeuta — Todos los derechos reservados</span>
        </footer>
      </div>
    </div>
  );
}
