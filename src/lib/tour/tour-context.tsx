"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { tourSteps, type TourStep } from "@/lib/tour/tour-steps";
import {
  clearTourPending,
  getTourPending,
  getTourSeen,
  setTourSeen,
} from "@/lib/tour/tour-store";

interface TourContextValue {
  active: boolean;
  stepIndex: number;
  stepCount: number;
  step: TourStep | null;
  start: () => void;
  next: () => void;
  prev: () => void;
  /** Cancel/skip the tour; also used when finishing. Never re-opens after this. */
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Auto-start once for first-time users (flag set at signup, and never seen).
  // stepIndex is already 0 on mount, so only `active` needs flipping here.
  useEffect(() => {
    if (getTourPending() && !getTourSeen()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(true);
    }
  }, []);

  const end = useCallback(() => {
    setTourSeen();
    clearTourPending();
    setActive(false);
  }, []);

  const start = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    setStepIndex((i) => {
      if (i >= tourSteps.length - 1) {
        end();
        return i;
      }
      return i + 1;
    });
  }, [end]);

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const step = active ? (tourSteps[stepIndex] ?? null) : null;

  // Keep the router on the current step's route (drives multi-screen navigation).
  useEffect(() => {
    if (!active) return;
    const target = tourSteps[stepIndex]?.route;
    if (target && pathname !== target) {
      router.push(target);
    }
  }, [active, stepIndex, pathname, router]);

  const value = useMemo<TourContextValue>(
    () => ({
      active,
      stepIndex,
      stepCount: tourSteps.length,
      step,
      start,
      next,
      prev,
      skip: end,
    }),
    [active, stepIndex, step, start, next, prev, end],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within <TourProvider>");
  return ctx;
}
