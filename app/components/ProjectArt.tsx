// Small drawings for the project tiles. Illustrative only, not real data.
// They take the tile's color from CSS (currentColor) and animate on hover.

import type { CSSProperties, JSX } from "react";
import type { ProjectArt as Kind } from "../content";

const vars = (v: Record<string, number>) => v as CSSProperties;

function Network() {
  const cx = 200;
  const cy = 112;
  const clients = [-90, -18, 54, 126, 198].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + 150 * Math.cos(a), y: cy + 78 * Math.sin(a) };
  });
  return (
    <>
      {clients.map((c, i) => (
        <line key={`l${i}`} className="art-link" x1={c.x} y1={c.y} x2={cx} y2={cy} />
      ))}
      {clients.map((c, i) => (
        // Model weights travelling from each client to the server
        <circle
          key={`d${i}`}
          className="art-dot"
          cx={c.x + (cx - c.x) * 0.28}
          cy={c.y + (cy - c.y) * 0.28}
          r={3.5}
          style={vars({ "--dx": (cx - c.x) * 0.52, "--dy": (cy - c.y) * 0.52, "--i": i })}
        />
      ))}
      {clients.map((c, i) => (
        <g key={`n${i}`}>
          <rect className="art-node" x={c.x - 16} y={c.y - 12} width={32} height={24} rx={7} />
          {[0, 1, 2].map((b) => (
            <rect
              key={b}
              className="art-fill"
              x={c.x - 8 + b * 6}
              y={c.y + 5 - (4 + ((i + b * 2) % 4) * 2)}
              width={3.5}
              height={4 + ((i + b * 2) % 4) * 2}
              rx={1}
            />
          ))}
        </g>
      ))}
      <circle className="art-ring" cx={cx} cy={cy} r={27} />
      <circle className="art-fill" cx={cx} cy={cy} r={15} />
    </>
  );
}

function Ultrasound() {
  const vein = "M30 172 C 130 150, 270 196, 370 168";
  const tip = { x: 200, y: 54 };
  const spread = (32 * Math.PI) / 180;
  return (
    <>
      <path className="art-vein-wall" d={vein} />
      <path className="art-vein" d={vein} />
      <ellipse className="art-hit" cx={200} cy={174} rx={30} ry={9} />
      {[28, 52, 76, 100, 122].map((r, i) => {
        const x0 = tip.x - r * Math.sin(spread);
        const x1 = tip.x + r * Math.sin(spread);
        const y = tip.y + r * Math.cos(spread);
        return (
          <path
            key={r}
            className="art-wave"
            d={`M${x0.toFixed(1)} ${y.toFixed(1)} A${r} ${r} 0 0 0 ${x1.toFixed(1)} ${y.toFixed(1)}`}
            style={vars({ "--i": i, opacity: 0.9 - i * 0.15 })}
          />
        );
      })}
      <rect className="art-node" x={172} y={16} width={56} height={34} rx={10} />
      <rect className="art-fill" x={186} y={50} width={28} height={6} rx={3} />
    </>
  );
}

function Bars() {
  const values = [0.42, 0.55, 0.38, 0.64, 0.58, 0.47, 0.72, 0.69, 0.5, 0.8, 0.62, 0.57, 0.86, 0.78];
  const base = 184;
  const tops = values.map((v, i) => ({ x: 64 + i * 21.6, y: base - v * 136 }));
  // Three-day rolling average, drawn over the bars
  const trend = tops.map((t, i) => {
    const near = tops.slice(Math.max(0, i - 1), i + 2);
    return [t.x, near.reduce((s, p) => s + p.y, 0) / near.length - 10] as const;
  });
  const last = trend[trend.length - 1];
  return (
    <>
      <line className="art-base" x1={48} x2={352} y1={base + 0.5} y2={base + 0.5} />
      {tops.map((t, i) => (
        <rect
          key={i}
          className="art-bar"
          x={t.x - 4.5}
          y={t.y}
          width={9}
          height={base - t.y}
          rx={4.5}
          style={vars({ "--i": i })}
        />
      ))}
      <polyline className="art-trend" points={trend.map(([x, y]) => `${x},${y.toFixed(1)}`).join(" ")} />
      <circle className="art-fill" cx={last[0]} cy={last[1]} r={5} />
    </>
  );
}

function Candles() {
  // [open, close, high, low]
  const candles = [
    [0.3, 0.38, 0.42, 0.26], [0.38, 0.34, 0.41, 0.3], [0.34, 0.45, 0.48, 0.32],
    [0.45, 0.42, 0.5, 0.39], [0.42, 0.52, 0.55, 0.4], [0.52, 0.49, 0.56, 0.45],
    [0.49, 0.58, 0.62, 0.47], [0.58, 0.55, 0.61, 0.51], [0.55, 0.66, 0.69, 0.53],
    [0.66, 0.62, 0.7, 0.58], [0.62, 0.71, 0.75, 0.6], [0.71, 0.76, 0.8, 0.68],
  ];
  const y = (v: number) => 190 - ((v - 0.26) / 0.54) * 150;
  const x = (i: number) => 52 + i * 24;
  const end = { x: 376, y: y(0.88) };
  return (
    <>
      {[64, 112, 160].map((gy) => (
        <line key={gy} className="art-base" x1={36} x2={364} y1={gy} y2={gy} />
      ))}
      {candles.map(([o, c, h, l], i) => (
        <g key={i} className={c >= o ? "art-up" : "art-down"}>
          <line className="art-wick" x1={x(i)} x2={x(i)} y1={y(h)} y2={y(l)} />
          <rect
            className="art-body"
            x={x(i) - 6}
            y={y(Math.max(o, c))}
            width={12}
            height={Math.max(2, Math.abs(y(o) - y(c)))}
            rx={2}
          />
        </g>
      ))}
      <line className="art-forecast" x1={x(11)} y1={y(0.76)} x2={end.x} y2={end.y} />
      <circle className="art-fill" cx={end.x} cy={end.y} r={4.5} />
    </>
  );
}

function Line() {
  return <path className="art-trend" d="M24 124 H150 l12 -30 l12 60 l12 -96 l12 120 l12 -54 H376" />;
}

const drawings: Record<Kind, () => JSX.Element> = {
  network: Network,
  ultrasound: Ultrasound,
  bars: Bars,
  candles: Candles,
};

export default function ProjectArt({ kind }: { kind?: Kind }) {
  const Drawing = kind ? drawings[kind] : Line;
  return (
    <svg className={`art art-${kind ?? "line"}`} viewBox="0 0 400 220" aria-hidden>
      <Drawing />
    </svg>
  );
}
