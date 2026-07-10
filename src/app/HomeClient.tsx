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
    <div className="relative z-10 min-h-screen overflow-x-hidden">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <SiteHeader />

        <main className="grid items-center gap-8 py-10 lg:grid-cols-[1.15fr_1fr]">

          {/* Hero */}
          <section className="rounded-[32px] border border-white/70 bg-white p-8 shadow-[0_8px_40px_rgba(26,107,80,0.09)] sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5ee] px-4 py-2 text-sm font-bold tracking-wide text-[#1a6b50]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ca878]" />
              Un refugio para familias extraordinarias
            </span>

            <h1 className="mt-7 text-[clamp(44px,7vw,70px)] font-black leading-[0.93] tracking-tight text-[#0e3d2f]">
              Neuro<span className="text-[#1a6b50]">pGen</span>
            </h1>

            <h2 className="mt-4 text-[clamp(18px,2.4vw,26px)] font-semibold leading-snug text-[#1a6b50]/80">
              Conectando la genética, el neurodesarrollo y las familias.
            </h2>

            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[#4a6058]">
              NeuropGen acerca información confiable, clara y humana sobre genética y neuropsicología a pacientes, familias y profesionales de salud.
            </p>

            <blockquote className="mt-8 rounded-2xl bg-gradient-to-br from-[#0e3d2f] to-[#1a6b50] p-6 text-[15px] font-medium leading-relaxed text-white/90 shadow-[0_12px_36px_rgba(14,61,47,0.28)]">
              <span className="mb-2 block text-[28px] leading-none text-[#a8dfc4]/60">&ldquo;</span>
              Cuando llega un diagnóstico, también puede empezar un camino acompañado, con palabras simples y pasos posibles.
              <span className="block text-right text-[28px] leading-none text-[#a8dfc4]/60">&rdquo;</span>
            </blockquote>
          </section>

          {/* Módulos */}
          <section aria-label="Módulos principales" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {site.sections.map((section, i) => (
              <article
                key={section.id}
                className="card-hover flex min-h-[268px] flex-col justify-between rounded-[28px] border border-[#d0eedd]/60 bg-white p-6 shadow-[0_4px_20px_rgba(26,107,80,0.07)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div>
                  <span className="grid h-[50px] w-[50px] place-items-center rounded-2xl bg-[#e8f5ee] text-[22px] shadow-inner">
                    {section.icon}
                  </span>
                  <h3 className="mt-5 text-[20px] font-extrabold leading-tight text-[#0e3d2f]">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#5a7268]">
                    {section.summary}
                  </p>
                </div>

                <Link
                  href={cardLinks[section.id] || "/"}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-[#1a6b50] px-5 py-2.5 text-[14px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#0e3d2f]"
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

        <footer className="mb-2 rounded-2xl bg-[#0e3d2f] px-6 py-5 text-center text-[13px] leading-relaxed text-white/70">
          Neuropsicólogo Andrés Escalera Páez · Dra. Belen Prieto Corona · Dra. Sulema Rojas · Dra. Julieta Moreno · Dr. Edgar Ricardez
          <br />
          <span className="text-white/40">© {new Date().getFullYear()} Neurapeuta — Todos los derechos reservados</span>
        </footer>
      </div>
    </div>
  );
}
