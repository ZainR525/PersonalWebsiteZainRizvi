"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Rises into place the first time it scrolls into view. `blur` adds Apple's
// soft-focus-to-sharp entrance, best kept for headlines.
export default function Reveal({
  children,
  className,
  delay = 0,
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32, ...(blur && { filter: "blur(12px)" }) }}
      whileInView={{ opacity: 1, y: 0, ...(blur && { filter: "blur(0px)" }) }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ type: "spring", bounce: 0, visualDuration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
