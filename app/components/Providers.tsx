"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Critically damped springs by default (no overshoot), per Apple's guidance.
// reducedMotion="user" turns movement into fades for people who ask for less motion.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", bounce: 0, visualDuration: 0.4 }}>
      {children}
    </MotionConfig>
  );
}
