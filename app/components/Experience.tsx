"use client";

// Jobs as a deck: each card pins near the top and the next one slides up over
// it, while the cards underneath sink back and dim.

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";
import type { Experience as Job } from "../content";

export default function Experience({ items }: { items: Job[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 96px", "end end"] });

  return (
    <div ref={ref} className="stack">
      {items.map((job, i) => (
        <Card key={job.org} job={job} index={i} total={items.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Card({
  job,
  index,
  total,
  progress,
}: {
  job: Job;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const above = total - 1 - index; // cards that will end up stacked on this one
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - above * 0.04]);
  const shade = useTransform(progress, [start, 1], [0, above * 0.25]);

  return (
    <div className="stack-slot" style={{ "--i": index } as CSSProperties}>
      <motion.article
        className="job"
        data-tone={job.tone}
        style={{ scale, originY: 0 }}
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: "spring", bounce: 0, visualDuration: 0.8 }}
      >
        <div className="job-head">
          <p className="job-dates">
            <span className="dot" aria-hidden />
            {job.dates}
          </p>
          <h3>{job.role}</h3>
          <p className="job-org">
            {job.org}
            {job.context ? <span className="job-context">{job.context}</span> : null}
          </p>
        </div>
        <ul className="job-points">
          {job.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <motion.div className="job-shade" style={{ opacity: shade }} aria-hidden />
      </motion.article>
    </div>
  );
}
