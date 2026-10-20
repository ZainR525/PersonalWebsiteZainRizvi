"use client";

// Project tiles in an Apple-style bento grid. Tapping one expands it into a
// full card, like App Store stories, and closing shrinks it back into its
// spot. The card can also be dragged down to dismiss.
//
// Only one element per project exists at a time (tile or card), so Motion
// morphs a single surface between the two instead of crossfading copies.

import { AnimatePresence, LayoutGroup, motion, useDragControls, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../content";
import ProjectArt from "./ProjectArt";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// A sheet gets a little bounce, like Apple's drawers (damping around 0.8).
const sheetSpring = { type: "spring", bounce: 0.18, visualDuration: 0.45 } as const;
const press = { type: "spring", bounce: 0, visualDuration: 0.15 } as const;
const morph = { layout: sheetSpring };
// Card chrome fades in once the card has mostly opened, so it never looks squashed.
const appear = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { type: "tween", ease: "easeOut", duration: 0.25, delay: 0.2 } },
} as const;

export default function Projects({ items }: { items: Project[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  // The tile flying back from the card rides above the fading scrim until it lands.
  const [returningId, setReturningId] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const open = items.find((p) => slug(p.name) === openId);

  const close = useCallback(() => {
    setReturningId(lastOpened.current);
    setOpenId(null);
  }, []);

  // Give focus back to the tile that opened the card.
  useEffect(() => {
    if (openId) lastOpened.current = openId;
    else if (lastOpened.current) buttons.current.get(lastOpened.current)?.focus({ preventScroll: true });
  }, [openId]);

  // Fallback in case the return animation is skipped (reduced motion).
  useEffect(() => {
    if (!returningId) return;
    const t = setTimeout(() => setReturningId(null), 1200);
    return () => clearTimeout(t);
  }, [returningId]);

  return (
    <LayoutGroup>
      <ul className="bento">
        {items.map((p, i) => {
          const id = slug(p.name);
          const wide = i % 4 === 0 || i % 4 === 3;
          return (
            <li key={id} className="bento-cell" data-wide={wide || undefined}>
              {openId === id ? (
                <div className="tile-placeholder" />
              ) : (
                <Tile
                  project={p}
                  id={id}
                  returning={returningId === id}
                  onOpen={() => setOpenId(id)}
                  onLanded={() => setReturningId(null)}
                  buttonRef={(el) => {
                    if (el) buttons.current.set(id, el);
                    else buttons.current.delete(id);
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
      <AnimatePresence>{openId ? <Scrim key="scrim" onClose={close} /> : null}</AnimatePresence>
      {open && openId ? <Sheet key={openId} project={open} id={openId} onClose={close} /> : null}
    </LayoutGroup>
  );
}

function Tile({
  project,
  id,
  returning,
  onOpen,
  onLanded,
  buttonRef,
}: {
  project: Project;
  id: string;
  returning: boolean;
  onOpen: () => void;
  onLanded: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <motion.article
      layoutId={`card-${id}`}
      className="tile"
      data-tone={project.tone}
      data-returning={returning || undefined}
      style={{ borderRadius: 28 }}
      whileTap={{ scale: 0.97 }}
      transition={{ layout: sheetSpring, scale: press }}
      onLayoutAnimationComplete={returning ? onLanded : undefined}
    >
      <motion.div layoutId={`art-${id}`} className="tile-art" transition={morph}>
        <motion.div layout className="art-frame" transition={morph}>
          <ProjectArt kind={project.art} />
        </motion.div>
      </motion.div>
      <motion.div layoutId={`text-${id}`} layout="position" className="card-head tile-text" transition={morph}>
        <h3 className="card-title">
          <button ref={buttonRef} type="button" className="tile-button" onClick={onOpen} aria-haspopup="dialog">
            {project.name}
          </button>
        </h3>
        <Meta project={project} />
      </motion.div>
      <motion.span layout className="tile-plus" transition={morph} aria-hidden>
        <svg viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </motion.span>
    </motion.article>
  );
}

function Meta({ project }: { project: Project }) {
  return (
    <p className="card-meta">
      {project.status ? <span className="status">{project.status}</span> : null}
      {project.stack.join(" · ")}
    </p>
  );
}

function Scrim({ onClose }: { onClose: () => void }) {
  return createPortal(
    <motion.div
      className="scrim"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
    />,
    document.body,
  );
}

function Sheet({ project, id, onClose }: { project: Project; id: string; onClose: () => void }) {
  const drag = useDragControls();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // While open: the page behind can't scroll or take focus, and Escape closes.
  useEffect(() => {
    const page = document.getElementById("page");
    const root = document.documentElement;
    page?.setAttribute("inert", "");
    root.classList.add("sheet-open");
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      page?.removeAttribute("inert");
      root.classList.remove("sheet-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="sheet-layer">
      <motion.div
        layoutId={`card-${id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="sheet"
        data-tone={project.tone}
        style={{ borderRadius: 32 }}
        transition={morph}
        drag="y"
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
        {...(reduce && { initial: { opacity: 0 }, animate: { opacity: 1 } })}
      >
        <div className="sheet-grab" onPointerDown={(e) => drag.start(e)}>
          <motion.div layoutId={`art-${id}`} className="tile-art sheet-art" transition={morph}>
            <motion.div layout className="art-frame" transition={morph}>
              <ProjectArt kind={project.art} />
            </motion.div>
          </motion.div>
          <motion.span className="sheet-handle" {...appear} aria-hidden />
        </div>
        <motion.div layoutId={`text-${id}`} layout="position" className="card-head" transition={morph}>
          <h2 id={`${id}-title`} className="card-title">
            {project.name}
          </h2>
          <Meta project={project} />
        </motion.div>
        {/* Waits for the header to land, then rises in */}
        <motion.div
          className="sheet-details"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, visualDuration: 0.4, delay: 0.26 } }}
        >
          <p className="sheet-text">{project.description}</p>
          {project.link ? (
            <a className="button button-primary" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label}
              <svg className="button-icon" viewBox="0 0 16 16" aria-hidden>
                <path d="M5 11L11 5M6 5h5v5" />
              </svg>
            </a>
          ) : null}
        </motion.div>
        <motion.button
          ref={closeRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close"
          {...appear}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </motion.button>
      </motion.div>
    </div>,
    document.body,
  );
}
