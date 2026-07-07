"use client";

const CX = 85;        // center x of helix
const AMP = 50;       // amplitude
const PERIOD = 180;   // px per full cycle
const TOTAL = 1080;   // total height

// Build a smooth sine-wave path using cubic beziers.
// Each half-period is one bezier segment.
function buildHelixPath(phase: number): string {
  const halfP = PERIOD / 2;
  const cp = AMP * 1.2; // control-point offset ≈ (4/3)*tan(π/4)*amp for a circle approximation

  let d = "";
  let y = 0;
  let segments = 0;

  while (y < TOTAL) {
    const angle = ((y / PERIOD) * 2 * Math.PI) + phase;
    const x = CX + AMP * Math.sin(angle);

    const nextY = y + halfP;
    const nextAngle = ((nextY / PERIOD) * 2 * Math.PI) + phase;
    const nextX = CX + AMP * Math.sin(nextAngle);

    // Control points: vertical tangent at peaks, horizontal tangent at crossings
    const cy1 = y + halfP * 0.45;
    const cy2 = y + halfP * 0.55;

    // Direction of curve: if going right (+AMP), control points push outward
    const dir = Math.cos(angle) > 0 ? 1 : -1;
    const cpOffset = cp * dir;

    if (segments === 0) {
      d += `M ${x.toFixed(1)},${y} `;
    }
    d += `C ${(x + cpOffset).toFixed(1)},${cy1.toFixed(1)} ${(nextX - cpOffset).toFixed(1)},${cy2.toFixed(1)} ${nextX.toFixed(1)},${nextY.toFixed(1)} `;

    y = nextY;
    segments++;
  }

  return d;
}

// Base pair lines: draw short horizontal lines at intervals where strands are apart
interface BasePair { y: number; x1: number; x2: number }
function buildBasePairs(): BasePair[] {
  const pairs: BasePair[] = [];
  const pairInterval = PERIOD / 10;
  for (let y = pairInterval; y < TOTAL; y += pairInterval) {
    const angle = (y / PERIOD) * 2 * Math.PI;
    const sinVal = Math.sin(angle);
    if (Math.abs(sinVal) > 0.25) {
      pairs.push({
        y,
        x1: CX + AMP * sinVal,
        x2: CX - AMP * sinVal,
      });
    }
  }
  return pairs;
}

const strand1 = buildHelixPath(0);
const strand2 = buildHelixPath(Math.PI);
const pairs = buildBasePairs();

const NODES = [
  { cx: 380, cy: 140, r: 3.5 },
  { cx: 530, cy: 210, r: 2.5 },
  { cx: 680, cy: 100, r: 4 },
  { cx: 790, cy: 290, r: 2.5 },
  { cx: 590, cy: 380, r: 3.5 },
  { cx: 840, cy: 440, r: 2.5 },
  { cx: 430, cy: 490, r: 3 },
  { cx: 730, cy: 560, r: 2.5 },
  { cx: 330, cy: 650, r: 3 },
  { cx: 630, cy: 730, r: 4 },
  { cx: 870, cy: 680, r: 2.5 },
  { cx: 480, cy: 790, r: 3.5 },
  { cx: 750, cy: 850, r: 2.5 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [1, 4], [4, 6], [5, 7], [6, 8], [7, 9],
  [8, 9], [9, 10], [9, 11], [10, 12],
];

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
        viewBox="0 0 960 1080"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="helixFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f8f73" stopOpacity="0" />
            <stop offset="15%" stopColor="#2f8f73" stopOpacity="1" />
            <stop offset="85%" stopColor="#2f8f73" stopOpacity="1" />
            <stop offset="100%" stopColor="#2f8f73" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="helix2Fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5dc391" stopOpacity="0" />
            <stop offset="15%" stopColor="#5dc391" stopOpacity="1" />
            <stop offset="85%" stopColor="#5dc391" stopOpacity="1" />
            <stop offset="100%" stopColor="#5dc391" stopOpacity="0" />
          </linearGradient>
          <mask id="helixMask">
            <rect width="960" height="1080" fill="url(#helixFade)" />
          </mask>
          <mask id="helix2Mask">
            <rect width="960" height="1080" fill="url(#helix2Fade)" />
          </mask>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base pairs */}
        <g opacity="0.18" mask="url(#helixMask)">
          {pairs.map((bp, i) => (
            <line
              key={i}
              x1={bp.x1.toFixed(1)} y1={bp.y.toFixed(1)}
              x2={bp.x2.toFixed(1)} y2={bp.y.toFixed(1)}
              stroke="#2f8f73"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Strand 2 (back, lighter) */}
        <path
          d={strand2}
          fill="none"
          stroke="#5dc391"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.22"
          mask="url(#helix2Mask)"
          filter="url(#glow)"
          style={{ animation: "helixFloat 9s ease-in-out infinite" }}
        />

        {/* Strand 1 (front, stronger) */}
        <path
          d={strand1}
          fill="none"
          stroke="#2f8f73"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.28"
          mask="url(#helixMask)"
          filter="url(#glow)"
          style={{ animation: "helixFloat 9s ease-in-out infinite reverse" }}
        />

        {/* Molecular network */}
        <g opacity="0.13">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a].cx} y1={NODES[a].cy}
              x2={NODES[b].cx} y2={NODES[b].cy}
              stroke="#2f8f73"
              strokeWidth="0.7"
            />
          ))}
        </g>

        {NODES.map((n, i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle
              cx={n.cx} cy={n.cy} r={n.r + 6}
              fill="#2f8f73" opacity="0.04"
            />
            <circle
              cx={n.cx} cy={n.cy} r={n.r}
              fill="none"
              stroke="#2f8f73"
              strokeWidth="1"
              opacity="0.22"
              style={{
                animation: `nodePulse ${3.5 + (i % 4) * 0.7}s ease-in-out infinite`,
                animationDelay: `${(i * 0.35).toFixed(2)}s`,
              }}
            />
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes helixFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.38; }
        }
      `}</style>
    </div>
  );
}
