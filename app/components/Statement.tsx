"use client";

// The intro paragraph lights up one word at a time as it scrolls up the screen.

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { Tone } from "../content";

type Piece = { text: string; tone?: Tone };

// Splits the text into words, each made of pieces so a highlight can stop
// mid-word (for example "medicine" colored, its period not).
function splitWords(text: string, highlights: Partial<Record<Tone, string>>) {
  const ranges = (Object.entries(highlights) as [Tone, string][])
    .map(([tone, phrase]) => ({ tone, start: text.indexOf(phrase), end: text.indexOf(phrase) + phrase.length }))
    .filter((r) => r.start >= 0);
  const toneAt = (i: number) => ranges.find((r) => i >= r.start && i < r.end)?.tone;

  const words: Piece[][] = [];
  for (const match of text.matchAll(/\S+/g)) {
    const start = match.index ?? 0;
    const pieces: Piece[] = [];
    for (let i = 0; i < match[0].length; i++) {
      const tone = toneAt(start + i);
      const last = pieces[pieces.length - 1];
      if (last && last.tone === tone) last.text += match[0][i];
      else pieces.push({ text: match[0][i], tone });
    }
    words.push(pieces);
  }
  return words;
}

export default function Statement({
  text,
  highlights,
}: {
  text: string;
  highlights: Partial<Record<Tone, string>>;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = splitWords(text, highlights);

  return (
    <section className="statement" aria-label="About me">
      <p ref={ref} className="statement-text">
        {words.map((pieces, i) => (
          <Word key={i} pieces={pieces} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>
    </section>
  );
}

function Word({
  pieces,
  progress,
  range,
}: {
  pieces: Piece[];
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span className="word" style={{ opacity }}>
        {pieces.map((p, i) => (
          <span key={i} data-tone={p.tone}>
            {p.text}
          </span>
        ))}
      </motion.span>{" "}
    </>
  );
}
