"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Gift,
  Lock,
  Clock3,
  Zap,
  ShieldAlert,
  TimerReset,
} from "lucide-react";

/*
  ===========================================================
  DEEP WORK ECONOMY SYSTEM
  ===========================================================

  CORE IDEA
  ----------
  - 1 hour 30 minutes uninterrupted deep work
  - earns 1 hour 30 minutes reward/free time
  - free time DECAYS throughout the day
  - if deep work is active:
      reward decay pauses
  - if distraction happens:
      deep work breaks
  - uses localStorage
  - persistent across refresh
  - no Tailwind
  - inline CSS only
  - framer motion animations
  - one-page application

  ===========================================================
*/

const DEEP_WORK_SECONDS = 60 * 60 + 30 * 60; // 1h 30m
const REWARD_SECONDS = 60 * 60 + 30 * 60;

const STORAGE_KEY = "deep_work_economy_v1";

type AppState = {
  deepWorkRemaining: number;
  rewardRemaining: number;

  isDeepWorking: boolean;

  lastTimestamp: number;

  currentDay: string;

  completedSessions: number;
};

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

function getTodayKey() {
  return new Date().toDateString();
}

export default function Page() {
  const [mounted, setMounted] = useState(false);

  const [state, setState] = useState<AppState>({
    deepWorkRemaining: DEEP_WORK_SECONDS,
    rewardRemaining: 0,

    isDeepWorking: false,

    lastTimestamp: Date.now(),

    currentDay: getTodayKey(),

    completedSessions: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /*
    ===========================================================
    LOAD STORAGE
    ===========================================================
  */

  useEffect(() => {
    setMounted(true);

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
      const parsed: AppState = JSON.parse(raw);

      const now = Date.now();

      let updated = { ...parsed };

      /*
        =======================================================
        DAILY RESET
        =======================================================
      */

      if (parsed.currentDay !== getTodayKey()) {
        updated.deepWorkRemaining = DEEP_WORK_SECONDS;
        updated.currentDay = getTodayKey();
      }

      /*
        =======================================================
        OFFLINE PROGRESSION
        =======================================================

        If deep work was OFF:
          reward decays while away

        If deep work was ON:
          deep work continues while away
          reward DOES NOT decay
      */

      const elapsed = Math.floor((now - parsed.lastTimestamp) / 1000);

      if (elapsed > 0) {
        if (parsed.isDeepWorking) {
          updated.deepWorkRemaining = Math.max(
            0,
            parsed.deepWorkRemaining - elapsed
          );

          /*
            COMPLETE SESSION
          */

          if (updated.deepWorkRemaining <= 0) {
            updated.deepWorkRemaining = DEEP_WORK_SECONDS;

            updated.rewardRemaining += REWARD_SECONDS;

            updated.completedSessions += 1;

            updated.isDeepWorking = false;
          }
        } else {
          updated.rewardRemaining = Math.max(
            0,
            parsed.rewardRemaining - elapsed
          );
        }
      }

      updated.lastTimestamp = now;

      setState(updated);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /*
    ===========================================================
    SAVE STORAGE
    ===========================================================
  */

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastTimestamp: Date.now(),
      })
    );
  }, [state, mounted]);

  /*
    ===========================================================
    MAIN TICK LOOP
    ===========================================================
  */

  useEffect(() => {
    if (!mounted) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const next = { ...prev };

        /*
          =====================================================
          DAILY RESET
          =====================================================
        */

        if (next.currentDay !== getTodayKey()) {
          next.currentDay = getTodayKey();
          next.deepWorkRemaining = DEEP_WORK_SECONDS;
        }

        /*
          =====================================================
          DEEP WORK ACTIVE
          =====================================================
        */

        if (next.isDeepWorking) {
          next.deepWorkRemaining = Math.max(
            0,
            next.deepWorkRemaining - 1
          );

          /*
            COMPLETE SESSION
          */

          if (next.deepWorkRemaining <= 0) {
            next.deepWorkRemaining = DEEP_WORK_SECONDS;

            next.rewardRemaining += REWARD_SECONDS;

            next.completedSessions += 1;

            next.isDeepWorking = false;
          }
        }

        /*
          =====================================================
          NOT WORKING
          REWARD DECAYS
          =====================================================
        */

        else {
          next.rewardRemaining = Math.max(
            0,
            next.rewardRemaining - 1
          );
        }

        next.lastTimestamp = Date.now();

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
    ===========================================================
    PROGRESS
    ===========================================================
  */

  const deepProgress = useMemo(() => {
    return (
      ((DEEP_WORK_SECONDS - state.deepWorkRemaining) /
        DEEP_WORK_SECONDS) *
      100
    );
  }, [state.deepWorkRemaining]);

  const rewardProgress = useMemo(() => {
    return (state.rewardRemaining / REWARD_SECONDS) * 100;
  }, [state.rewardRemaining]);

  /*
    ===========================================================
    ACTIONS
    ===========================================================
  */

  const startDeepWork = () => {
    setState((prev) => ({
      ...prev,
      isDeepWorking: true,
    }));
  };

  const stopDeepWork = () => {
    setState((prev) => ({
      ...prev,
      isDeepWorking: false,
    }));
  };

  const resetEverything = () => {
    const next: AppState = {
      deepWorkRemaining: DEEP_WORK_SECONDS,
      rewardRemaining: 0,
      isDeepWorking: false,
      lastTimestamp: Date.now(),
      currentDay: getTodayKey(),
      completedSessions: 0,
    };

    setState(next);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  /*
    ===========================================================
    UI
    ===========================================================
  */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #151515 0%, #050505 60%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: 900,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 30,
          padding: 28,
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <motion.div
            animate={{
              rotate: state.isDeepWorking ? 360 : 0,
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              background:
                "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={36} />
          </motion.div>

          <div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              Deep Work Economy
            </div>

            <div
              style={{
                opacity: 0.7,
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              1 hour 30 minutes uninterrupted focus earns
              1 hour 30 minutes freedom.
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {/* DEEP WORK */}

          <motion.div
            layout
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 24,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                opacity: state.isDeepWorking ? 0.18 : 0.06,
              }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,#4f46e5,#7c3aed)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Zap size={20} />
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Deep Work
                </div>
              </div>

              <div
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  letterSpacing: -3,
                  marginBottom: 16,
                }}
              >
                {formatTime(state.deepWorkRemaining)}
              </div>

              {/* PROGRESS */}

              <div
                style={{
                  width: "100%",
                  height: 16,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  marginBottom: 20,
                }}
              >
                <motion.div
                  animate={{
                    width: `${deepProgress}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                  }}
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg,#4f46e5,#7c3aed)",
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                {state.isDeepWorking ? (
                  <motion.div
                    key="working"
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#93c5fd",
                      fontWeight: 700,
                    }}
                  >
                    <Lock size={18} />
                    No intentional-action gap.
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#fca5a5",
                      fontWeight: 700,
                    }}
                  >
                    <ShieldAlert size={18} />
                    Distraction leaks future freedom.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* REWARD */}

          <motion.div
            layout
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 24,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                opacity: state.isDeepWorking ? 0.06 : 0.15,
              }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Gift size={20} />
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Earned Freedom
                </div>
              </div>

              <div
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  letterSpacing: -3,
                  marginBottom: 16,
                }}
              >
                {formatTime(state.rewardRemaining)}
              </div>

              <div
                style={{
                  width: "100%",
                  height: 16,
                  borderRadius: 999,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.08)",
                  marginBottom: 20,
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
                    stiffness: 60,
                  }}
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg,#22c55e,#16a34a)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  opacity: 0.85,
                }}
              >
                <Clock3 size={18} />

                {state.isDeepWorking ? (
                  <div>
                    Reward decay paused during focus.
                  </div>
                ) : (
                  <div>
                    Free time continuously decays.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CONTROLS */}

        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {!state.isDeepWorking ? (
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={startDeepWork}
              style={{
                border: "none",
                background:
                  "linear-gradient(135deg,#4f46e5,#7c3aed)",
                color: "white",
                padding: "18px 26px",
                borderRadius: 18,
                fontWeight: 800,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                boxShadow:
                  "0 10px 30px rgba(99,102,241,0.35)",
              }}
            >
              <Play size={20} />
              Start Deep Work
            </motion.button>
          ) : (
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={stopDeepWork}
              style={{
                border: "none",
                background:
                  "linear-gradient(135deg,#ef4444,#dc2626)",
                color: "white",
                padding: "18px 26px",
                borderRadius: 18,
                fontWeight: 800,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                boxShadow:
                  "0 10px 30px rgba(239,68,68,0.35)",
              }}
            >
              <Pause size={20} />
              Stop Session
            </motion.button>
          )}

          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={resetEverything}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              padding: "18px 26px",
              borderRadius: 18,
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={20} />
            Reset Economy
          </motion.button>
        </div>

        {/* METRICS */}

        <div
          style={{
            marginTop: 34,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          <MetricCard
            icon={<Brain size={22} />}
            title="Completed Sessions"
            value={String(state.completedSessions)}
          />

          <MetricCard
            icon={<TimerReset size={22} />}
            title="Reward State"
            value={
              state.rewardRemaining > 0
                ? "Freedom Available"
                : "Empty"
            }
          />

          <MetricCard
            icon={<Lock size={22} />}
            title="Current Mode"
            value={
              state.isDeepWorking
                ? "Locked In"
                : "Leaking Time"
            }
          />
        </div>

        {/* PHILOSOPHY */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          style={{
            marginTop: 36,
            padding: 22,
            borderRadius: 22,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 12,
              color: "white",
            }}
          >
            System Logic
          </div>

          <div>
            This system converts focus into temporary freedom.
            Deep work is treated like economic production.
            Free time is treated like a decaying asset.
            Uninterrupted concentration creates reward.
            Passive drifting destroys stored freedom over time.
          </div>

          <div
            style={{
              marginTop: 16,
            }}
          >
            While focused, entropy pauses.
            While distracted, your earned freedom leaks away
            second by second.
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: 0.7,
          marginBottom: 14,
        }}
      >
        {icon}
        <div>{title}</div>
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}
