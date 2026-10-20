"use client";

import { motion } from "motion/react";
import { H, W, gridPath, heartPath } from "./signal";

const draw = { hidden: { pathLength: 0 }, shown: { pathLength: 1 } };
const ease = [0.45, 0.05, 0.35, 1] as const;

// The hero line again, small, drawn once when the footer comes into view.
export default function Pulse() {
  return (
    <motion.svg
      className="pulse"
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.path className="pulse-grid" d={gridPath} variants={draw} transition={{ duration: 1.1, ease }} />
      <motion.path
        className="pulse-heart"
        d={heartPath}
        variants={draw}
        transition={{ duration: 0.9, delay: 1.1, ease }}
      />
    </motion.svg>
  );
}
