import Link from "next/link";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "/enfermedades", label: "Enfermedades Genéticas" },
  { href: "/psicoeducacion", label: "Psicoeducación" },
  { href: "/recursos", label: "Recursos para Familias" },
  { href: "/grupo-apoyo", label: "Grupo de Apoyo" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-7">
      <Logo />
      <nav className="flex flex-wrap gap-2.5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-pill rounded-full px-3.5 py-2.5 text-sm font-semibold"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
