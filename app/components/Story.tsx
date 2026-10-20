"use client";

// Shares the hero's scroll progress with the nav, so the name can fly from the
// hero into the nav bar and the bar can frost over once it lands.

import { useScroll, type MotionValue } from "motion/react";
import { createContext, use, useRef, type ReactNode, type RefObject } from "react";

type Story = {
  heroRef: RefObject<HTMLElement | null>;
  wordmarkRef: RefObject<HTMLAnchorElement | null>;
  progress: MotionValue<number>;
};

const StoryContext = createContext<Story | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  return (
    <StoryContext value={{ heroRef, wordmarkRef, progress: scrollYProgress }}>
      {children}
    </StoryContext>
  );
}

export function useStory() {
  const story = use(StoryContext);
  if (!story) throw new Error("useStory needs a StoryProvider above it");
  return story;
}

// Hero timeline, as fractions of the hero's scroll length.
export const FLY: [number, number] = [0, 0.1]; // name flies into the nav
export const LANDED: [number, number] = [0.092, 0.1]; // name hands off to the nav wordmark
export const FROST: [number, number] = [0.1, 0.15]; // nav bar frosts over
