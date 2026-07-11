import Link from "next/link";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "/enfermedades",  label: "Enfermedades" },
  { href: "/psicoeducacion", label: "Psicoeducación" },
  { href: "/recursos",      label: "Recursos" },
  { href: "/grupo-apoyo",   label: "Grupo de Apoyo" },
  { href: "/admin",         label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="site-nav">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <nav style={{ display: "flex", gap: 4 }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-2)",
                textDecoration: "none",
                transition: "color .15s, background .15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--green)"; (e.currentTarget as HTMLElement).style.background = "var(--green-light)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
