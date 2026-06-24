"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useCms } from "@/components/CmsProvider";

const cardLinks: Record<string, string> = {
  enfermedades: "/enfermedades",
  psicoeducacion: "/psicoeducacion",
  recursos: "/recursos",
  "grupo-apoyo": "/grupo-apoyo"
};

export function HomeClient() {
  const { site } = useCms();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <SiteHeader />
        <main className="grid items-center gap-7 py-9 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-[28px] border border-stone-200 bg-white/85 p-7 shadow-soft sm:p-11">
            <span className="inline-flex rounded-full bg-clinical-50 px-3.5 py-2 font-black text-clinical-600">
              Un refugio para familias extraordinarias
            </span>
            <h1 className="mt-6 text-[56px] font-black leading-[0.95] text-clinical-600 sm:text-[72px]">NeuropGen</h1>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-clinical-500 sm:text-3xl">
              Conectando la genética, el neurodesarrollo y las familias.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-500">
              NeuropGen es una plataforma de psicoeducación genética y neuropsicológica diseñada para acercar información
              confiable, clara y humana a pacientes, familias y profesionales.
            </p>
            <div className="mt-7 rounded-2xl bg-gradient-to-br from-[#08705e] to-[#4bb289] p-5 font-bold text-white shadow-lg">
              &ldquo;Cuando llega un diagnóstico, también puede empezar un camino acompañado, con palabras simples y pasos
              posibles.&rdquo;
            </div>
          </section>

          <section aria-label="Módulos principales" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {site.sections.map((section) => (
              <article
                key={section.id}
                className="flex min-h-[260px] flex-col justify-between rounded-[28px] border border-stone-200 bg-white/85 p-6 shadow-soft"
              >
                <div>
                  <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-stone-100 text-2xl">
                    {section.icon}
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold leading-tight text-[#1c2b25]">{section.title}</h3>
                  <p className="mt-2 text-stone-500">{section.summary}</p>
                </div>
                <Link
                  href={cardLinks[section.id] || "/"}
                  className="mt-4 inline-flex self-start rounded-2xl bg-clinical-500 px-4.5 py-3 font-black text-white hover:bg-clinical-600"
                >
                  Acceder
                </Link>
              </article>
            ))}
          </section>
        </main>
        <footer className="rounded-3xl bg-clinical-700 px-4 py-6 text-center text-sm text-white/85">
          Creación por parte de Neuropsicólogo Andrés Escalera Páez, Dra. Belen Prieto Corona, Dra. Sulema Rojas, Dra.
          Julieta Moreno, Dr. Edgar Ricardez.
          <br />© {new Date().getFullYear()} Neurapeuta. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
