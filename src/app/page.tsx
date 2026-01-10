"use client";

import { useEffect, useState } from "react";

type RoutineItem =
  | { label: string; type: "done" }
  | { label: string; type: "sets"; sets: number; record?: number }
  | { label: string; type: "time"; value: string }
  | { label: string; type: "options"; options: string[] }
  | { label: string; type: "count"; unit: string };

type RoutineSection = {
  section: string;
  items: RoutineItem[];
};

const STORAGE_KEY = "daily-routine-progress";
const SKIPPED_KEY = "daily-routine-skipped";
const DATE_KEY = "daily-routine-date";
const STREAK_KEY = "daily-routine-streak";

const routineData = [
    {
        section: "🏆 MORNING ROUTINE",
        items: [
            //Sleep
            { label: "Sleep", type: "options", options: ["3 hrs", "5 hrs", "8 hrs"] },
            //Wake

            //Facial Appearance + Bed Hygiene
            { label: "Neck Curl", type: "sets", sets: 4, record: 56 },
            { label: "Neck Tuck", type: "sets", sets: 4, record: 73 },
            { label: "Clean Bed", type: "done" },

            //Facial Hygiene
            { label: "Hydrate", type: "count", unit: "glass" },
            { label: "Light Exposure", type: "done" },
            { label: "Wash Face (Cleanser)", type: "done" },
            { label: "Apply Moisturizer", type: "done" },
            { label: "Apply Sunscreen", type: "done" },
            { label: "Hydrate 2", type: "count", unit: "glass" },
            { label: "Brush Teeth", type: "done" },

            //Warm-up
            { label: "Increase Heart Rate", type: "time", value: "3 mins" },
            { label: "Dynamic Mobility", type: "time", value: "7 mins" },

            //Exercise
            { label: "Push Ups", type: "sets", sets: 3, record: 87 },
            { label: "Hydrate 3", type: "count", unit: "glass" },
            { label: "Elevated Push Ups", type: "sets", sets: 2, record: 30 },
            { label: "Hydrate 4", type: "count", unit: "glass" },
            { label: "Lateral Raise", type: "sets", sets: 2, record: 22 },
            { label: "Hydrate 5", type: "count", unit: "glass" },
            { label: "Dumbbell Row", type: "sets", sets: 3, record: 72 },
            { label: "Hydrate 6", type: "count", unit: "glass" },

            //Cooldown
            { label: "Slowly Decrease Heart Rate", type: "time", value: "3 mins" },
            { label: "Static Stretch", type: "time", value: "7 mins" },
            { label: "Hydrate 7", type: "count", unit: "glass" },

            //Hygiene
            { label: "Shower", type: "done" },
            { label: "Hydrate 8", type: "count", unit: "glass" },

            //Consume
            { label: "Eat Healthy (Protein)", type: "done" },
            { label: "Hydrate 9", type: "count", unit: "glass" },

            //Work
            { label: "30m Work", type: "done" },
            { label: "Hydrate 10", type: "count", unit: "glass" },
            { label: "30m Work 2", type: "done" },
            { label: "Hydrate 11", type: "count", unit: "glass" },

            //Warm-up
            { label: "Increase Heart Rate 2", type: "time", value: "3 mins" },
            { label: "Dynamic Mobility 2", type: "time", value: "7 mins" },

            //Exercise
            { label: "Bicep Curls", type: "sets", sets: 3 },
            { label: "Hydrate 12", type: "count", unit: "glass" },
            { label: "Pull Ups", type: "sets", sets: 3 },
            { label: "Hydrate 13", type: "count", unit: "glass" },
            { label: "Weight Squats", type: "sets", sets: 3 },
            { label: "Hydrate 14", type: "count", unit: "glass" },
            { label: "Plank", type: "sets", sets: 2 },
            { label: "Hydrate 15", type: "count", unit: "glass" },
            
            //Cooldown
            { label: "Slowly Decrease Heart Rate 2", type: "time", value: "3 mins" },
            { label: "Static Stretch 2", type: "time", value: "7 mins" },
            { label: "Hydrate 16", type: "count", unit: "glass" },
            
            //Consume
            { label: "Eat Healthy (Veggies)", type: "done" },
            { label: "Hydrate 17", type: "count", unit: "glass" },
            
            //Work Cycle
            { label: "30m Work 3", type: "done" },
            { label: "Meditate", type: "count", unit: "glass" },
            { label: "30m Work 4", type: "done" },
            { label: "Meditate 2", type: "count", unit: "glass" },
            { label: "30m Work 5", type: "done" },
            { label: "Hydrate 18", type: "count", unit: "glass" },
            
            //Work Cycle
            { label: "30m Work 6", type: "done" },
            { label: "Meditate 3", type: "count", unit: "glass" },
            { label: "30m Work 7", type: "done" },
            { label: "Meditate 4", type: "count", unit: "glass" },
            { label: "30m Work 8", type: "done" },
            { label: "Hydrate 19", type: "count", unit: "glass" },

            //Work Cycle
            { label: "30m Work 9", type: "done" },
            { label: "Meditate 5", type: "count", unit: "glass" },
            { label: "30m Work 10", type: "done" },
            { label: "Meditate 6", type: "count", unit: "glass" },
            { label: "30m Work 11", type: "done" },
            { label: "Hydrate 20", type: "count", unit: "glass" },

            //Work Cycle
            { label: "30m Work 12", type: "done" },
            { label: "Meditate 7", type: "count", unit: "glass" },
            { label: "30m Work 13", type: "done" },
            { label: "Meditate 8", type: "count", unit: "glass" },
            { label: "30m Work 14", type: "done" },
            { label: "Hydrate 21", type: "count", unit: "glass" },

            //Night Routine
            { label: "Clean Environment", type: "done" },
            { label: "Wash Face (Cleanser) 2", type: "done" },
            { label: "Apply Moisturizer 2", type: "done" },
            { label: "Brush Teeth 2", type: "done" },
            { label: "Other Hygiene", type: "done" },
            
            //Her
            { label: "Goodnight and Sleepwell", type: "done" },
            { label: "Show Her Progress", type: "done" },
            { label: "Variety of I love you", type: "done" },

            { label: "Stretch + Diaphragm Breathing", type: "done" },
            { label: "Read Books Until Sleepy", type: "done" },
        ],
    },
];


export default function DailyRoutine() {
    const [state, setState] = useState<Record<string, boolean>>({});
    const [skippedState, setSkippedState] = useState<Record<string, boolean>>({});
    const [tab, setTab] = useState<"todo" | "done" | "skipped">("todo");
    const [streak, setStreak] = useState<number>(0);

    useEffect(() => {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem(DATE_KEY);
        const savedStreak = Number(localStorage.getItem(STREAK_KEY) || 0);

        let newStreak = 1;

        if (savedDate) {
            const diff =
                (new Date(today).getTime() - new Date(savedDate).getTime()) /
                (1000 * 60 * 60 * 24);
            if (diff === 1) newStreak = savedStreak + 1;
            else if (diff > 1) newStreak = 1;
            else newStreak = savedStreak;
        }

        setStreak(newStreak);

        if (savedDate !== today) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(SKIPPED_KEY);
            localStorage.setItem(DATE_KEY, today);
            localStorage.setItem(STREAK_KEY, String(newStreak));
            setState({});
            setSkippedState({});
        } else {
            const saved = localStorage.getItem(STORAGE_KEY);
            const skipped = localStorage.getItem(SKIPPED_KEY);
            if (saved) setState(JSON.parse(saved) as Record<string, boolean>);
            if (skipped) setSkippedState(JSON.parse(skipped) as Record<string, boolean>);
        }
    }, []);

    // Save state and streak
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        localStorage.setItem(SKIPPED_KEY, JSON.stringify(skippedState));
        localStorage.setItem(STREAK_KEY, String(streak));
    }, [state, skippedState, streak]);

    // Toggle task completion
    const toggle = (key: string) => {
        // Remove from skipped if marking as done/undo
        setSkippedState((prev) => ({ ...prev, [key]: false }));
        setState((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Skip a task
    const skip = (key: string) => {
        // Remove from done if skipping
        setState((prev) => ({ ...prev, [key]: false }));
        setSkippedState((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Calculate progress
    const totalTasks = routineData.reduce((sum, section) => sum + section.items.length, 0);
    const completedTasks = Object.values(state).filter(Boolean).length;
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);

    const styles = {
        page: { minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: 16, fontFamily: "system-ui, sans-serif" },
        tabs: { display: "flex", gap: 8, marginBottom: 16 },
        tab: (active) => ({ flex: 1, padding: 10, borderRadius: 10, backgroundColor: active ? "#16a34a" : "#27272a", border: "none", color: "#fff", fontWeight: 600 }),
        card: { backgroundColor: "#18181b", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
        subtitle: { color: "#a1a1aa", fontSize: 13 },
        progressContainer: { backgroundColor: "#27272a", borderRadius: 10, overflow: "hidden", margin: "10px 0", height: 20 },
        progressBar: { height: "100%", backgroundColor: "#16a34a", transition: "width 0.3s" },
        buttonGroup: { display: "flex", gap: 8 },
    };

    return (
        <div style={styles.page}>
            <h1>Daily Routine</h1>
            🔥 Day Streak: {streak}

            {/* Progress Bar */}
            <div style={styles.progressContainer}>
                <div style={{ ...styles.progressBar, width: `${progressPercent}%` }} />
            </div>
            {progressPercent}% Completed

            <div style={styles.tabs}>
                <button style={styles.tab(tab === "todo")} onClick={() => setTab("todo")}>To Do</button>
                <button style={styles.tab(tab === "done")} onClick={() => setTab("done")}>Done</button>
                <button style={styles.tab(tab === "skipped")} onClick={() => setTab("skipped")}>Skipped</button>
            </div>

            {routineData.map((section) => (
                <div key={section.section}>
                    <h2>{section.section}</h2>

                    {section.items
                        .filter((item) => {
                            if (tab === "todo") return !state[item.label] && !skippedState[item.label];
                            if (tab === "done") return state[item.label];
                            if (tab === "skipped") return skippedState[item.label];
                            return false;
                        })
                        .map((item) => {
                            const key = item.label;

                            return (
                                <div key={key} style={styles.card}>
                                    <div>
                                        <div>{item.label}</div>
                                        {item.type === "sets" && (
                                            <div style={styles.subtitle}>
                                                Sets: {item.sets} {item.record ? `• Record: ${item.record}` : ""}
                                            </div>
                                        )}
                                        {item.type === "time" && <div style={styles.subtitle}>{item.value}</div>}
                                        {item.type === "options" && (
                                            <div style={styles.subtitle}>{item.options.join(" / ")}</div>
                                        )}
                                    </div>

                                    <div style={styles.buttonGroup}>
                                        {tab !== "skipped" && (
                                            <button
                                                onClick={() => toggle(key)}
                                                style={{
                                                    padding: "8px 14px",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    backgroundColor: "#16a34a",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {tab === "done" ? "Undo" : "Done"}
                                            </button>
                                        )}
                                        {tab !== "done" && (
                                            <button
                                                onClick={() => skip(key)}
                                                style={{
                                                    padding: "8px 14px",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    backgroundColor: "#f59e0b",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {skippedState[key] ? "Undo Skip" : "Skip"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            ))}
        </div>
    );
}
