"use client";

const HELIX_CENTER_X = 90;
const HELIX_AMPLITUDE = 52;
const HELIX_PERIOD = 160;
const HELIX_HEIGHT = 1000;
const STEP = 12;

function buildStrandPath(phase: number): string {
  const points: string[] = [];
  for (let y = 0; y <= HELIX_HEIGHT; y += STEP) {
    const angle = ((y / HELIX_PERIOD) * 2 * Math.PI) + phase;
    const x = HELIX_CENTER_X + HELIX_AMPLITUDE * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y}`);
  }
  return "M " + points.join(" L ");
}

interface BasePair { y: number; x1: number; x2: number; opacity: number }

function buildBasePairs(): BasePair[] {
  const pairs: BasePair[] = [];
  for (let y = 0; y <= HELIX_HEIGHT; y += STEP) {
    const angle = (y / HELIX_PERIOD) * 2 * Math.PI;
    const x1 = HELIX_CENTER_X + HELIX_AMPLITUDE * Math.sin(angle);
    const x2 = HELIX_CENTER_X - HELIX_AMPLITUDE * Math.sin(angle);
    const dist = Math.abs(x1 - x2);
    const maxDist = HELIX_AMPLITUDE * 2;
    if (dist > maxDist * 0.5) {
      pairs.push({ y, x1, x2, opacity: (dist / maxDist) * 0.22 });
    }
  }
  return pairs;
}

const NODES = [
  { cx: 320, cy: 120, r: 4 },
  { cx: 480, cy: 200, r: 3 },
  { cx: 650, cy: 90, r: 5 },
  { cx: 750, cy: 280, r: 3 },
  { cx: 560, cy: 360, r: 4 },
  { cx: 820, cy: 420, r: 3 },
  { cx: 400, cy: 480, r: 4 },
  { cx: 700, cy: 530, r: 3 },
  { cx: 300, cy: 620, r: 3 },
  { cx: 600, cy: 700, r: 5 },
  { cx: 850, cy: 660, r: 3 },
  { cx: 450, cy: 760, r: 4 },
  { cx: 720, cy: 820, r: 3 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [1, 4], [4, 6], [5, 7], [6, 8], [7, 9],
  [8, 9], [9, 10], [9, 11], [10, 12],
];

const strand1Path = buildStrandPath(0);
const strand2Path = buildStrandPath(Math.PI);
const basePairs = buildBasePairs();

export function GeneticBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 900 1000"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="strand1Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f8f73" stopOpacity="0" />
            <stop offset="20%" stopColor="#2f8f73" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#4bb289" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4bb289" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strand2Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5dc391" stopOpacity="0" />
            <stop offset="20%" stopColor="#5dc391" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#2f8f73" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2f8f73" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Helix base pairs */}
        {basePairs.map((bp, i) => (
          <line
            key={i}
            x1={bp.x1.toFixed(1)}
            y1={bp.y}
            x2={bp.x2.toFixed(1)}
            y2={bp.y}
            stroke="#2f8f73"
            strokeWidth="1"
            opacity={bp.opacity}
          />
        ))}

        {/* Helix strand 2 (back) */}
        <path
          d={strand2Path}
          fill="none"
          stroke="url(#strand2Grad)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ animation: "helixDrift 8s ease-in-out infinite" }}
        />

        {/* Helix strand 1 (front) */}
        <path
          d={strand1Path}
          fill="none"
          stroke="url(#strand1Grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ animation: "helixDrift 8s ease-in-out infinite reverse" }}
        />

        {/* Molecular network edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].cx}
            y1={NODES[a].cy}
            x2={NODES[b].cx}
            y2={NODES[b].cy}
            stroke="#2f8f73"
            strokeWidth="0.8"
            opacity="0.12"
          />
        ))}

        {/* Molecular network nodes */}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r + 4}
              fill="#2f8f73"
              opacity="0.05"
              filter="url(#softGlow)"
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill="none"
              stroke="#2f8f73"
              strokeWidth="1"
              opacity="0.2"
              style={{
                animation: `nodePulse ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.4).toFixed(1)}s`,
              }}
            />
          </g>
        ))}

        {/* Subtle horizontal scan line */}
        <line
          x1="0" y1="0" x2="900" y2="0"
          stroke="#2f8f73"
          strokeWidth="0.5"
          opacity="0.15"
          style={{ animation: "scanLine 12s linear infinite" }}
        />
      </svg>

      <style>{`
        @keyframes helixDrift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.18; r: var(--r, 4); }
          50% { opacity: 0.35; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-10px); opacity: 0; }
          5% { opacity: 0.15; }
          95% { opacity: 0.1; }
          100% { transform: translateY(1010px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
