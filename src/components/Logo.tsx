import Link from "next/link";
import { Brain } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black text-clinical-600">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-clinical-400 to-clinical-600 text-white">
        <Brain className="h-5 w-5" />
      </span>
      NeuropGen
    </Link>
  );
}
