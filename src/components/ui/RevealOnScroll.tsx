"use client";

import { useEffect } from "react";

/**
 * Drives the `.rh-reveal` entrance animation. Items already on screen at load
 * animate on mount straight from CSS (no JS wait, stagger intact). This only
 * touches items that start BELOW the fold: it holds them hidden, then plays
 * the reveal once they scroll into view — so the effect actually happens where
 * the user can see it instead of finishing off-screen. Mounted once globally.
 *
 * No-JS and reduced-motion users keep the plain animate-on-mount fallback.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("rh-reveal-hold");
            entry.target.classList.add("rh-in-view");
            io.unobserve(entry.target);
          }
        }
      },
      // Trigger a touch before the item is fully on screen so the reveal reads
      // as it settles into view.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const seen = new WeakSet<Element>();
    const process = () => {
      document.querySelectorAll(".rh-reveal").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        // Already on screen → leave it; it animates on mount from CSS.
        if (rect.top < window.innerHeight && rect.bottom > 0) return;
        // Below the fold → hold hidden until it scrolls in.
        el.classList.add("rh-reveal-hold");
        io.observe(el);
      });
    };

    process();

    // Portfolio/app content mounts after data loads and route changes swap the
    // tree — pick up `.rh-reveal` nodes that appear later.
    const mo = new MutationObserver(process);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
