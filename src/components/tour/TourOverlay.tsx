"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTour } from "@/lib/tour/tour-context";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 6; // breathing room around the spotlighted element
const GAP = 12; // distance between the element and the balloon
const BALLOON_W = 340;
const DIM = "rgba(4,6,10,.6)"; // same backdrop tone as Modal.tsx

/**
 * Renders the first-time tour: a spotlight hole over the current step's target
 * plus an explanatory balloon. Target-less steps (welcome / closing) show a
 * centered card. Blocks page interaction while active; Esc or "Pular" cancels.
 */
export function TourOverlay() {
  const { active, step, stepIndex, stepCount, next, prev, skip } = useTour();
  const [box, setBox] = useState<Box | null>(null);

  const selector = step?.selector;

  // Locate + track the target element for the current step.
  useEffect(() => {
    if (!active || !selector) {
      // Clear any stale spotlight so target-less steps render centered and
      // route changes don't flash the previous target's position.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBox(null);
      return;
    }

    let raf = 0;
    let cancelled = false;
    const deadline = Date.now() + 4000; // keep retrying while the route mounts

    const measure = (el: Element) => {
      const r = el.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    const tick = () => {
      if (cancelled) return;
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        measure(el);
      }
      if (!el && Date.now() < deadline) {
        raf = requestAnimationFrame(tick);
      }
    };
    tick();

    const onViewportChange = () => {
      const el = document.querySelector(selector);
      if (el) measure(el);
    };
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [active, selector, stepIndex]);

  // Esc cancels the tour.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, skip]);

  if (!active || !step) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stepCount - 1;

  const balloon = (
    <div className="flex flex-col gap-3">
      <div>
        <div className="font-mono text-[11px] tracking-[0.12em] text-accent-text">
          {stepIndex + 1} de {stepCount}
        </div>
        <h2 className="mt-1.5 text-[16px] font-semibold tracking-tight">
          {step.title}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-text2">
          {step.body}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={skip}>
          Pular tutorial
        </Button>
        <div className="flex items-center gap-2">
          {!isFirst ? (
            <Button variant="secondary" size="sm" onClick={prev}>
              Voltar
            </Button>
          ) : null}
          <Button variant="primary" size="sm" onClick={next}>
            {isLast ? "Concluir" : "Próximo"}
          </Button>
        </div>
      </div>
    </div>
  );

  const cardClass =
    "pointer-events-auto rounded-[14px] border border-border bg-bg2 p-4 shadow-[var(--shadow)]";

  // Target-less step: centered card over a full dim backdrop.
  if (!box) {
    return (
      <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
        <div className="absolute inset-0" style={{ background: DIM }} />
        <div className={`${cardClass} relative z-[1] w-full max-w-[380px]`}>
          {balloon}
        </div>
      </div>
    );
  }

  // Spotlight geometry (viewport coords).
  const holeTop = box.top - PAD;
  const holeLeft = box.left - PAD;
  const holeW = box.width + PAD * 2;
  const holeH = box.height + PAD * 2;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 640;

  // Balloon placement: below the target by default, above if it sits low.
  const wantTop =
    step.placement === "top" ||
    ((step.placement === "auto" || step.placement === undefined) &&
      box.top > vh * 0.5);

  const balloonStyle: React.CSSProperties = isMobile
    ? { left: 16, right: 16, bottom: 16 }
    : {
        left: Math.min(
          Math.max(box.left + box.width / 2 - BALLOON_W / 2, 16),
          vw - BALLOON_W - 16,
        ),
        width: BALLOON_W,
        ...(wantTop
          ? { bottom: vh - box.top + GAP }
          : { top: box.top + box.height + GAP }),
      };

  return (
    <>
      {/* Click catcher: blocks interaction with the page while the tour runs. */}
      <div
        className="fixed inset-0 z-[55]"
        onMouseDown={(e) => e.preventDefault()}
      />
      {/* Spotlight: a transparent hole with a huge dimming box-shadow + accent ring. */}
      <div
        className="pointer-events-none fixed z-[56] rounded-[10px]"
        style={{
          top: holeTop,
          left: holeLeft,
          width: holeW,
          height: holeH,
          boxShadow: `0 0 0 9999px ${DIM}`,
          outline: "2px solid var(--accent)",
          outlineOffset: 2,
        }}
      />
      <div className={`${cardClass} fixed z-[57]`} style={balloonStyle}>
        {balloon}
      </div>
    </>
  );
}
