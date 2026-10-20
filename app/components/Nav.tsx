"use client";

import { motion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { FROST, LANDED, useStory } from "./Story";

type Section = { id: string; label: string };

export default function Nav({
  name,
  sections,
  resume,
}: {
  name: string;
  sections: Section[];
  resume?: string;
}) {
  const { progress, wordmarkRef } = useStory();
  const mark = useTransform(progress, LANDED, [0, 1]);
  const markVisibility = useTransform(mark, (v) => (v > 0 ? "visible" : "hidden"));
  const frost = useTransform(progress, FROST, [0, 1]);
  // The glass materializes: blur thickens as it fades in, not a flat fade.
  const backdrop = useTransform(
    frost,
    (v) => `blur(${(v * 20).toFixed(1)}px) saturate(${Math.round(100 + v * 80)}%)`,
  );
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <header className="nav">
      <motion.div
        className="nav-bg"
        style={{ opacity: frost, backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
        aria-hidden
      />
      <div className="nav-inner">
        <motion.a
          ref={wordmarkRef}
          href="#top"
          className="wordmark"
          style={{ opacity: mark, visibility: markVisibility }}
        >
          {name}
        </motion.a>
        <nav aria-label="Sections">
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
                  {active === s.id && <motion.span layoutId="nav-pill" className="nav-pill" />}
                  <span className="nav-label">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {resume ? (
          <a href={resume} className="nav-cta" target="_blank" rel="noreferrer">
            Resume
          </a>
        ) : null}
      </div>
    </header>
  );
}

// The section crossing the middle of the screen, or the last one at the very bottom.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    const list = key.split(" ");
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: string | null = atBottom ? list[list.length - 1] : null;
      if (!atBottom) {
        for (const id of list) {
          const r = document.getElementById(id)?.getBoundingClientRect();
          if (r && r.top <= mid && r.bottom > mid) current = id;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
