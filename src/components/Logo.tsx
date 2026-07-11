import Link from "next/link";
import { Brain } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 no-underline" style={{ color: "var(--text-1)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em", textDecoration: "none" }}>
      <span style={{
        width: 34, height: 34,
        borderRadius: "10px",
        background: "linear-gradient(135deg, #1a8f5e, #22c55e)",
        display: "grid", placeItems: "center",
        boxShadow: "0 2px 8px rgba(26,143,94,0.35)"
      }}>
        <Brain style={{ width: 18, height: 18, color: "#fff" }} />
      </span>
      NeuropGen
    </Link>
  );
}
