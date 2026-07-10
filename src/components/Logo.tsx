import Link from "next/link";
import { Brain } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black text-white">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-green-400 to-green-700 shadow-lg shadow-green-900/50">
        <Brain className="h-5 w-5 text-white" />
      </span>
      NeuropGen
    </Link>
  );
}
