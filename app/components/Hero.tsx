"use client";

// The opening scene, scrubbed by scroll like a video: the name flies up into
// the nav, then a blue pen draws a day of power grid demand that turns into a
// red heartbeat. Scrolling back up rewinds it.

import { cubicBezier, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { profile, signalCaptions } from "../content";
import { H, SPLIT, W, gridPath, heartPath, pointOnGrid, pointOnHeart, spikes } from "./signal";
import { FLY, LANDED, useStory } from "./Story";

// Fractions of the hero's scroll length.
const INTRO_OUT: [number, number] = [0, 0.07];
const CHART_IN: [number, number] = [0.05, 0.14];
const GRID: [number, number] = [0.12, 0.54];
const HEART: [number, number] = [0.57, 0.9];

const easeInOut = cubicBezier(0.65, 0, 0.35, 1);
const HOURS = ["12 AM", "6 AM", "Noon", "6 PM", "12 AM"];
const pct = (x: number) => `${(x / W) * 100}%`;

export default function Hero() {
  const { heroRef, wordmarkRef, progress } = useStory();
  const stageRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);

  // Measured on layout and resize, and kept in motion values so transforms follow.
  const flight = useMotionValue({ dx: 0, dy: 0, k: 1 });
  const frame = useMotionValue({ win: 0, pano: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const anchor = anchorRef.current;
      const mark = wordmarkRef.current;
      if (stage && anchor && mark) {
        // The stage is pinned to the top of the screen while the name flies,
        // so its coordinates line up with the fixed nav's.
        const s = stage.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        const m = mark.getBoundingClientRect();
        const k = m.width / a.width;
        flight.set({
          dx: m.left - a.left,
          dy: m.top + m.height / 2 - (k * a.height) / 2 - (a.top - s.top),
          k,
        });
      }
      if (windowRef.current && panoRef.current) {
        frame.set({ win: windowRef.current.clientWidth, pano: panoRef.current.clientWidth });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    for (const el of [stageRef.current, anchorRef.current, wordmarkRef.current, panoRef.current]) {
      if (el) ro.observe(el);
    }
    document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [flight, frame, wordmarkRef]);

  const fly = useTransform(progress, FLY, [0, 1], { ease: easeInOut });
  const nameX = useTransform(() => fly.get() * flight.get().dx);
  const nameY = useTransform(() => fly.get() * flight.get().dy);
  const nameScale = useTransform(() => 1 + fly.get() * (flight.get().k - 1));
  const nameOpacity = useTransform(progress, LANDED, [1, 0]);

  const introOpacity = useTransform(progress, INTRO_OUT, [1, 0]);
  const introY = useTransform(progress, INTRO_OUT, [0, -28]);
  const introBlur = useTransform(progress, INTRO_OUT, ["blur(0px)", "blur(10px)"]);
  const cueOpacity = useTransform(progress, [0, 0.03], [1, 0]);

  const chartOpacity = useTransform(progress, CHART_IN, [0, 1]);
  const chartScale = useTransform(progress, CHART_IN, [0.94, 1]);

  const grid = useTransform(progress, GRID, [0, 1]);
  const heart = useTransform(progress, HEART, [0, 1]);
  const gridShown = useTransform(grid, (v) => (v > 0 ? 1 : 0));
  const heartShown = useTransform(heart, (v) => (v > 0 ? 1 : 0));

  const pen = useTransform(() =>
    heart.get() > 0 ? pointOnHeart(heart.get()) : pointOnGrid(grid.get()),
  );
  const penX = useTransform(pen, (p) => p[0]);
  const penY = useTransform(pen, (p) => p[1]);
  const penOn = useTransform(grid, [0, 0.004], [0, 1]);
  const penBlue = useTransform(heart, [0, 0.02], [1, 0]);
  const penRed = useTransform(heart, [0, 0.02], [0, 1]);

  const split = useTransform(progress, [0.5, 0.555, 0.62], [0.25, 1, 0.35]);
  const gridGlow = useTransform(() => grid.get() * (1 - 0.6 * heart.get()));
  const ticks = useTransform(progress, [0.12, 0.2], [0, 1]);
  const gridCaption = useTransform(progress, [0.18, 0.26], [0, 1]);
  const heartCaption = useTransform(progress, [0.62, 0.7], [0, 1]);

  // On screens narrower than the line (phones), the view follows the pen.
  const panX = useTransform(() => {
    const { win, pano } = frame.get();
    const max = Math.max(0, pano - win);
    const ahead = (penX.get() / W) * pano - win * 0.62;
    return -Math.min(max, Math.max(0, ahead));
  });

  return (
    <section ref={heroRef} id="top" className="hero" aria-label="Introduction">
      <div ref={stageRef} className="hero-stage">
        <motion.div className="hero-paper" style={{ opacity: chartOpacity }} aria-hidden />

        <div className="hero-intro">
          <motion.p
            className="hero-eyebrow"
            style={{ opacity: introOpacity, y: introY, filter: introBlur }}
          >
            {profile.eyebrow}
          </motion.p>
          <div ref={anchorRef} className="hero-name-anchor">
            <motion.h1
              className="hero-name"
              style={{
                x: nameX,
                y: nameY,
                scale: nameScale,
                opacity: nameOpacity,
                originX: 0,
                originY: 0,
              }}
            >
              {profile.name}
            </motion.h1>
          </div>
          <motion.p
            className="hero-tagline"
            style={{ opacity: introOpacity, y: introY, filter: introBlur }}
          >
            {profile.tagline}
          </motion.p>
        </div>

        <motion.figure className="signal" style={{ opacity: chartOpacity, scale: chartScale }}>
          <div ref={windowRef} className="signal-window">
            <motion.div ref={panoRef} className="signal-pano" style={{ x: panX }}>
              <motion.div
                className="signal-glow signal-glow-grid"
                style={{ opacity: gridGlow, width: pct(SPLIT) }}
                aria-hidden
              />
              <motion.div
                className="signal-glow signal-glow-heart"
                style={{ opacity: heart, left: pct(SPLIT) }}
                aria-hidden
              />
              <svg
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label="A line tracing a day of power grid demand that turns into a heartbeat"
              >
                <defs>
                  <radialGradient id="pen-grid">
                    <stop offset="0" className="stop-grid" stopOpacity="0.6" />
                    <stop offset="1" className="stop-grid" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="pen-heart">
                    <stop offset="0" className="stop-heart" stopOpacity="0.7" />
                    <stop offset="1" className="stop-heart" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <motion.line
                  className="signal-split"
                  x1={SPLIT}
                  x2={SPLIT}
                  y1={8}
                  y2={H - 8}
                  style={{ opacity: split }}
                />
                <g className="tone-grid">
                  <motion.path
                    d={gridPath}
                    className="signal-line signal-halo"
                    style={{ pathLength: grid, opacity: gridShown }}
                  />
                  <motion.path
                    d={gridPath}
                    className="signal-line"
                    style={{ pathLength: grid, opacity: gridShown }}
                  />
                </g>
                <g className="tone-heart">
                  <motion.path
                    d={heartPath}
                    className="signal-line signal-halo"
                    style={{ pathLength: heart, opacity: heartShown }}
                  />
                  <motion.path
                    d={heartPath}
                    className="signal-line"
                    style={{ pathLength: heart, opacity: heartShown }}
                  />
                </g>
                {spikes.map((s) => (
                  <Flash key={s.at} at={s.at} x={s.x} y={s.y} heart={heart} />
                ))}
                <motion.g className="pen" style={{ opacity: penOn }}>
                  <motion.circle cx={penX} cy={penY} r={38} fill="url(#pen-grid)" style={{ opacity: penBlue }} />
                  <motion.circle cx={penX} cy={penY} r={38} fill="url(#pen-heart)" style={{ opacity: penRed }} />
                  <motion.circle cx={penX} cy={penY} r={5} className="pen-core" />
                </motion.g>
              </svg>
              <motion.div
                className="signal-ticks"
                style={{ opacity: ticks, width: pct(SPLIT) }}
                aria-hidden
              >
                {HOURS.map((h, i) => (
                  <span key={i} style={{ left: `${(i / (HOURS.length - 1)) * 100}%` }}>
                    {h}
                  </span>
                ))}
              </motion.div>
              <div className="signal-captions">
                <motion.p className="cap cap-grid" style={{ opacity: gridCaption, maxWidth: pct(SPLIT) }}>
                  {signalCaptions.grid}
                </motion.p>
                <motion.p className="cap" style={{ opacity: heartCaption, left: pct(SPLIT + 20) }}>
                  {signalCaptions.heart}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.figure>

        <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden>
          <span>Scroll</span>
          <svg viewBox="0 0 16 16">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

// A bloom at each heartbeat spike as the pen passes it.
function Flash({
  at,
  x,
  y,
  heart,
}: {
  at: number;
  x: number;
  y: number;
  heart: MotionValue<number>;
}) {
  const glow = useTransform(heart, [at - 0.015, at, at + 0.09], [0, 1, 0]);
  const r = useTransform(glow, [0, 1], [24, 70]);
  return (
    <motion.circle className="flash" cx={x} cy={y} r={r} fill="url(#pen-heart)" style={{ opacity: glow }} />
  );
}
