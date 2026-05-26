"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Gift,
  Sparkles,
} from "lucide-react";

/*
  ============================================================
  MOBILE FIRST DEEP WORK ECONOMY
  ============================================================

  - responsive
  - minimalist
  - smooth mobile UX
  - offline progression
  - reward decay
  - daily reset
  - AMOLED friendly
  - safe-area support

  ============================================================
*/

const WORK_SECONDS = 60 * 60 + 30 * 60;
const REWARD_SECONDS = 60 * 60 + 30 * 60;

const STORAGE_KEY = "deep_work_mobile_v3";

type State = {
  workRemaining: number;
  rewardRemaining: number;
  working: boolean;
  completed: number;
  lastUpdate: number;
  currentDay: string;
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

function todayKey() {
  return new Date().toDateString();
}

export default function Page() {
  const [mounted, setMounted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<State>({
    workRemaining: WORK_SECONDS,
    rewardRemaining: 0,
    working: false,
    completed: 0,
    lastUpdate: Date.now(),
    currentDay: todayKey(),
  });

  const isMobile =
    typeof window !== "undefined" &&
    window.innerWidth < 640;

  /*
    ============================================================
    LOAD STORAGE
    ============================================================
  */

  useEffect(() => {
    setMounted(true);

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
      const parsed: State = JSON.parse(raw);

      const now = Date.now();

      let next = { ...parsed };

      /*
        DAILY RESET
      */

      if (next.currentDay !== todayKey()) {
        next.currentDay = todayKey();
        next.workRemaining = WORK_SECONDS;
      }

      /*
        OFFLINE PROGRESSION
      */

      const elapsed = Math.floor(
        (now - parsed.lastUpdate) / 1000
      );

      if (elapsed > 0) {
        if (parsed.working) {
          next.workRemaining = Math.max(
            0,
            parsed.workRemaining - elapsed
          );

          if (next.workRemaining <= 0) {
            navigator.vibrate?.(120);

            next.workRemaining = WORK_SECONDS;
            next.rewardRemaining += REWARD_SECONDS;
            next.completed += 1;
            next.working = false;
          }
        } else {
          next.rewardRemaining = Math.max(
            0,
            parsed.rewardRemaining - elapsed
          );
        }
      }

      next.lastUpdate = now;

      setState(next);
    } catch {}
  }, []);

  /*
    ============================================================
    SAVE
    ============================================================
  */

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastUpdate: Date.now(),
      })
    );
  }, [state, mounted]);

  /*
    ============================================================
    LOOP
    ============================================================
  */

  useEffect(() => {
    if (!mounted) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const next = { ...prev };

        if (next.currentDay !== todayKey()) {
          next.currentDay = todayKey();
          next.workRemaining = WORK_SECONDS;
        }

        if (next.working) {
          next.workRemaining = Math.max(
            0,
            next.workRemaining - 1
          );

          if (next.workRemaining <= 0) {
            navigator.vibrate?.([100, 60, 100]);

            next.workRemaining = WORK_SECONDS;
            next.rewardRemaining += REWARD_SECONDS;
            next.completed += 1;
            next.working = false;
          }
        } else {
          next.rewardRemaining = Math.max(
            0,
            next.rewardRemaining - 1
          );
        }

        next.lastUpdate = Date.now();

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mounted]);

  /*
    ============================================================
    PROGRESS
    ============================================================
  */

  const workProgress = useMemo(() => {
    return (
      ((WORK_SECONDS - state.workRemaining) /
        WORK_SECONDS) *
      100
    );
  }, [state.workRemaining]);

  const rewardProgress = useMemo(() => {
    return (
      (state.rewardRemaining / REWARD_SECONDS) *
      100
    );
  }, [state.rewardRemaining]);

  /*
    ============================================================
    ACTIONS
    ============================================================
  */

  const start = () => {
    navigator.vibrate?.(30);

    setState((prev) => ({
      ...prev,
      working: true,
    }));
  };

  const stop = () => {
    navigator.vibrate?.(30);

    setState((prev) => ({
      ...prev,
      working: false,
    }));
  };

  const reset = () => {
    navigator.vibrate?.(60);

    const fresh: State = {
      workRemaining: WORK_SECONDS,
      rewardRemaining: 0,
      working: false,
      completed: 0,
      lastUpdate: Date.now(),
      currentDay: todayKey(),
    };

    setState(fresh);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(fresh)
    );
  };

  /*
    ============================================================
    UI
    ============================================================
  */

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          state.working
            ? "linear-gradient(180deg,#0f172a 0%, #020617 100%)"
            : "linear-gradient(180deg,#111827 0%, #030712 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding:
          "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",
        boxSizing: "border-box",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        style={{
          width: "100%",
          maxWidth: isMobile ? 430 : 520,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* TOP */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "clamp(24px,7vw,30px)",
                fontWeight: 800,
                letterSpacing: -1.5,
              }}
            >
              Focus
            </div>

            <div
              style={{
                opacity: 0.55,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              Deep work economy
            </div>
          </div>

          <motion.div
            animate={{
              rotate: state.working ? 360 : 0,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background:
                "rgba(255,255,255,0.045)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              flexShrink: 0,
            }}
          >
            <Brain size={22} />
          </motion.div>
        </div>

        {/* MAIN TIMER */}

        <motion.div
          layout
          style={{
            background:
              "rgba(255,255,255,0.045)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
            padding: 18,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18,
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                opacity: 0.7,
                fontWeight: 600,
              }}
            >
              Deep Work
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={String(state.working)}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                }}
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background:
                    state.working
                      ? "rgba(59,130,246,0.18)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    state.working
                      ? "#93c5fd"
                      : "rgba(255,255,255,0.7)",
                  whiteSpace: "nowrap",
                }}
              >
                {state.working
                  ? "Locked In"
                  : "Idle"}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* TIMER */}

          <motion.div
            key={state.workRemaining}
            initial={{
              scale: 0.98,
            }}
            animate={{
              scale: 1,
            }}
            style={{
              fontSize: "clamp(42px,13vw,72px)",
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {formatTime(state.workRemaining)}
          </motion.div>

          {/* BAR */}

          <div
            style={{
              marginTop: 20,
              width: "100%",
              height: 9,
              borderRadius: 999,
              background:
                "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                width: `${workProgress}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 50,
              }}
              style={{
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg,#60a5fa,#2563eb)",
              }}
            />
          </div>

          {/* BUTTON */}

          <motion.button
            whileTap={{
              scale: 0.97,
            }}
            whileHover={{
              scale: 1.01,
            }}
            onClick={
              state.working ? stop : start
            }
            style={{
              marginTop: 18,
              width: "100%",
              height: 54,
              minHeight: 54,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              color: "white",
              fontWeight: 800,
              fontSize: 15,
              background: state.working
                ? "linear-gradient(90deg,#ef4444,#dc2626)"
                : "linear-gradient(90deg,#3b82f6,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow:
                state.working
                  ? "0 12px 30px rgba(239,68,68,0.25)"
                  : "0 12px 30px rgba(59,130,246,0.25)",
              touchAction: "manipulation",
            }}
          >
            {state.working ? (
              <>
                <Pause size={18} />
                Stop Focus
              </>
            ) : (
              <>
                <Play size={18} />
                Start Focus
              </>
            )}
          </motion.button>
        </motion.div>

        {/* REWARD */}

        <motion.div
          layout
          style={{
            background:
              "rgba(255,255,255,0.045)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            borderRadius: 22,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Gift size={17} />

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Earned Freedom
              </div>
            </div>

            <div
              style={{
                opacity: 0.6,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {state.completed} sessions
            </div>
          </div>

          <div
            style={{
              fontSize: "clamp(32px,10vw,44px)",
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            {formatTime(state.rewardRemaining)}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              opacity: 0.5,
            }}
          >
            available guilt-free time
          </div>

          {/* BAR */}

          <div
            style={{
              marginTop: 14,
              width: "100%",
              height: 8,
              borderRadius: 999,
              background:
                "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                width: `${Math.min(
                  rewardProgress,
                  100
                )}%`,
              }}
              transition={{
                type: "spring",
              }}
              style={{
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg,#4ade80,#22c55e)",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 12,
              lineHeight: 1.6,
              opacity: 0.6,
            }}
          >
            {state.working
              ? "Reward decay paused while focusing."
              : "Freedom continuously decays over time."}
          </div>
        </motion.div>

        {/* MINI CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10,
          }}
        >
          <SmallCard
            title="Mode"
            value={
              state.working
                ? "Focused"
                : "Distracted"
            }
            icon={<Sparkles size={17} />}
          />

          <motion.button
            whileTap={{
              scale: 0.97,
            }}
            onClick={reset}
            style={{
              background:
                "rgba(255,255,255,0.045)",
              borderRadius: 18,
              padding: 14,
              color: "white",
              textAlign: "left",
              cursor: "pointer",
              border:
                "1px solid rgba(255,255,255,0.06)",
              minHeight: 110,
              touchAction: "manipulation",
            }}
          >
            <div
              style={{
                marginBottom: 10,
                opacity: 0.7,
              }}
            >
              <RotateCcw size={17} />
            </div>

            <div
              style={{
                fontSize: 12,
                opacity: 0.6,
                marginBottom: 4,
              }}
            >
              Reset
            </div>

            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Economy
            </div>
          </motion.button>
        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            opacity: 0.35,
            lineHeight: 1.7,
            paddingBottom: 10,
            paddingTop: 4,
          }}
        >
          uninterrupted focus creates freedom
        </div>
      </motion.div>
    </div>
  );
}

function SmallCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      style={{
        background:
          "rgba(255,255,255,0.045)",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 14,
        minHeight: 110,
      }}
    >
      <div
        style={{
          marginBottom: 10,
          opacity: 0.7,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 12,
          opacity: 0.6,
          marginBottom: 4,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}
