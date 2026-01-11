"use client";

import { useEffect, useState } from "react";

type RoutineItem = | { label: string; type: "done" } | { label: string; type: "sets"; sets: number; record?: number } | { label: string; type: "time"; value: string } | { label: string; type: "options"; options: string[] } | { label: string; type: "count"; unit: string };

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
        section: "DAILY ROUTINE",
        items: [
            //Sleep
            { label: "Sleep Total 3hrs", type: "done" },
            { label: "Sleep Total 5hrs", type: "done" },
            { label: "Sleep Total 8hrs", type: "done" },
            
            //Wakup Warmup
            { label: "Making Amethyst Morning Feel Good", type: "done" },
            { label: "Warm-up 7mins", type: "done" },
            { label: "Neck Warm-up 2mins", type: "done" },

            //Facial Appearance + Bed Hygiene
            { label: "Neck Curl Set 1", type: "done" },
            { label: "4-4-8 Breathing 1min Set 1", type: "done" },
            { label: "Neck Curl Set 2", type: "done" },
            { label: "4-4-8 Breathing 1min Set 2", type: "done" },
            { label: "Neck Curl Set 3", type: "done" },
            { label: "4-4-8 Breathing 1min Set 3", type: "done" },
            { label: "Neck Curl Set 4", type: "done" },
            { label: "4-4-8 Breathing 1min Set 4", type: "done" },
            { label: "Neck Tuck Set 1", type: "done" },
            { label: "4-4-8 Breathing 1min Set 5", type: "done" },
            { label: "Neck Tuck Set 2", type: "done" },
            { label: "4-4-8 Breathing 1min Set 6", type: "done" },
            { label: "Neck Tuck Set 3", type: "done" },
            { label: "4-4-8 Breathing 1min Set 7", type: "done" },
            { label: "Neck Tuck Set 4", type: "done" },
            { label: "4-4-8 Breathing 1min Set 8", type: "done" },
            { label: "Clean Bed", type: "done" },

            //Facial Hygiene
            { label: "Drink 1 Glass Set 1", type: "count", unit: "glass" },
            { label: "Light Exposure", type: "done" },
            { label: "Wash Face (Cleanser) Set 1", type: "done" },
            { label: "Apply Moisturizer Set 1", type: "done" },
            { label: "Apply Sunscreen", type: "done" },
            { label: "Drink 1 Glass Set 2", type: "count", unit: "glass" },
            { label: "Brush Teeth Set 1", type: "done" },

            //Hobby
            { label: "Play Instruments for 15mins Set 1", type: "done" },
            { label: "Play Instruments for 15mins Set 2", type: "done" },
            { label: "Play Instruments for 15mins Set 3", type: "done" },
            { label: "Play Instruments for 15mins Set 4", type: "done" },

            //Consume
            { label: "Eat Healthy (Fiber, Complex Carbs, Protein)", type: "done" },
            { label: "Drink 1/2 Glass Probiotics/Water", type: "count", unit: "glass" },

            //Warm-up
            { label: "Increase Heart Rate Set 1", type: "time", value: "3 mins" },
            { label: "Dynamic Mobility Set 2", type: "time", value: "7 mins" },

            //Exercise
            { label: "Push Up Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 3", type: "count", unit: "glass" },
            { label: "Push Up Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 4", type: "count", unit: "glass" },
            { label: "Push Up Set 3", type: "done" },
            { label: "Drink 1/8 Glass Set 5", type: "count", unit: "glass" },
            { label: "Elevated Push Ups Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 6", type: "count", unit: "glass" },
            { label: "Elevated Push Ups Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 7", type: "count", unit: "glass" },
            { label: "Lateral Raise Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 8", type: "count", unit: "glass" },
            { label: "Lateral Raise Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 9", type: "count", unit: "glass" },
            { label: "Dumbbell Row Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 10", type: "count", unit: "glass" },
            { label: "Dumbbell Row Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 11", type: "count", unit: "glass" },
            { label: "Dumbbell Row Set 3", type: "done" },
            { label: "Drink 1/8 Glass Set 12", type: "count", unit: "glass" },

            //Cooldown
            { label: "Slowly Decrease Heart Rate", type: "time", value: "3 mins" },
            { label: "Static Stretch", type: "time", value: "7 mins" },
            { label: "Drink 1/4 Glass Set 13", type: "count", unit: "glass" },

            //Hygiene
            { label: "Shower", type: "done" },
            { label: "Drink 1/4 Glass Set 14", type: "count", unit: "glass" },

            //Consume
            { label: "Eat Healthy (Protein)", type: "done" },
            { label: "Drink 1/4 Glass Set 15", type: "count", unit: "glass" },
            
            //Total Water Drinked 4.5

            //Work
            { label: "30m Work", type: "done" },
            { label: "Drink 1/2 Glass Set 16", type: "count", unit: "glass" },
            { label: "30m Work 2", type: "done" },
            { label: "Drink 1/2 Glass Set 17", type: "count", unit: "glass" },

            //Total Water Drinked 5.5

            //Warm-up
            { label: "Increase Heart Rate 2", type: "time", value: "3 mins" },
            { label: "Dynamic Mobility 2", type: "time", value: "7 mins" },

            //Exercise
            { label: "Bicep Curl Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 18", type: "count", unit: "glass" },
            { label: "Bicep Curl Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 19", type: "count", unit: "glass" },
            { label: "Bicep Curl Set 3", type: "done" },
            { label: "Drink 1/8 Glass Set 20", type: "count", unit: "glass" },
            { label: "Pull Up Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 21", type: "count", unit: "glass" },
            { label: "Pull Up Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 22", type: "count", unit: "glass" },
            { label: "Pull Up Set 3", type: "done" },
            { label: "Drink 1/8 Glass Set 23", type: "count", unit: "glass" },
            { label: "Weight Squats Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 24", type: "count", unit: "glass" },
            { label: "Weight Squats Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 25", type: "count", unit: "glass" },
            { label: "Weight Squats Set 3", type: "done" },
            { label: "Drink 1/8 Glass Set 26", type: "count", unit: "glass" },
            { label: "Plank Set 1", type: "done" },
            { label: "Drink 1/8 Glass Set 27", type: "count", unit: "glass" },
            { label: "Plank Set 2", type: "done" },
            { label: "Drink 1/8 Glass Set 28", type: "count", unit: "glass" },

            //Cooldown
            { label: "Slowly Decrease Heart Rate 2", type: "time", value: "3 mins" },
            { label: "Static Stretch 2", type: "time", value: "7 mins" },
            { label: "Drink 1/8 Glass Set 29", type: "count", unit: "glass" },

            //Consume
            { label: "Eat Healthy (Veggies) Set 1", type: "done" },
            { label: "Drink 1/4 Glass Set 30", type: "count", unit: "glass" },

            //Work Cycle
            { label: "30m Work 3", type: "done" },
            { label: "Drink 1/4 Glass Set 31", type: "count", unit: "glass" },
            { label: "30m Work 4", type: "done" },
            { label: "Drink 1/4 Glass Set 32", type: "count", unit: "glass" },
            { label: "30m Work 5", type: "done" },
            { label: "Meditate Set 1", type: "done" },
            
            { label: "Drink 1 Glass Set 33", type: "count", unit: "glass" },
            
            //Total Water Drinked 8.5

            //Work Cycle
            { label: "30m Work 6", type: "done" },
            { label: "Drink 1/4 Glass Set 34", type: "count", unit: "glass" },
            { label: "30m Work 7", type: "done" },
            { label: "Drink 1/4 Glass Set 35", type: "count", unit: "glass" },
            { label: "30m Work 8", type: "done" },
            { label: "Meditate Set 2", type: "done" },

            //Work Cycle
            { label: "30m Work 9", type: "done" },
            { label: "Drink 1/4 Glass Set 36", type: "count", unit: "glass" },
            { label: "30m Work 10", type: "done" },
            { label: "Drink 1/4 Glass Set 37", type: "count", unit: "glass" },
            { label: "30m Work 11", type: "done" },
            { label: "Meditate Set 3", type: "done" },
            
            //Total Water Drinked 9.5

            //Work Cycle
            { label: "30m Work 12", type: "done" },
            { label: "Drink 1/4 Glass Set 38", type: "count", unit: "glass" },
            { label: "30m Work 13", type: "done" },
            { label: "Drink 1/4 Glass Set 39", type: "count", unit: "glass" },
            { label: "30m Work 14", type: "done" },
            { label: "Meditate Set 4", type: "done" },
            
            //Consume
            { label: "Eat Healthy (Veggies) Set 2", type: "done" },
            { label: "Drink 1 Glass Set 40", type: "count", unit: "glass" },
            
            //Total Water Drinked 10.5

            //Night Routine
            { label: "Clean Environment", type: "done" },
            { label: "Wash Face (Cleanser) Set 2", type: "done" },
            { label: "Apply Moisturizer Set 2", type: "done" },
            { label: "Brush Teeth Set 2", type: "done" },
            { label: "Other Hygiene", type: "done" },

            //Her
            { label: "Make Amethyst Night Feel Good", type: "done" },

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
            //localStorage.removeItem(STORAGE_KEY);
            //localStorage.removeItem(SKIPPED_KEY);
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
    const maxLevel = 100/37.3737;
    const exponent = 0.7;
    const progressPercent = Math.round(100 * Math.pow(completedTasks / totalTasks, exponent));


    const styles = {
        page: { minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: 16, fontFamily: "system-ui, sans-serif" },
        tabs: { display: "flex", gap: 8, marginBottom: 16, marginTop: '8px'},
        tab: (active: boolean) => ({ flex: 1, padding: 10, borderRadius: 10, backgroundColor: active ? "#16a34a" : "#27272a", border: "none", color: "#fff", fontWeight: 600 }),
            card: { backgroundColor: "#18181b", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
        subtitle: { color: "#a1a1aa", fontSize: 13 },
        progressContainer: { backgroundColor: "#27272a", borderRadius: 10, overflow: "hidden", margin: "10px 0", height: 20 },
        progressBar: { height: "100%", backgroundColor: "#16a34a", transition: "width 0.3s" },
        buttonGroup: { display: "flex", gap: 8 },
    };

    return (
        <div style={styles.page}>
        <h1>Daily Routine</h1>
        Day Streak: {streak}
        <br/>
        Level: {`${Math.floor(progressPercent/maxLevel)}`}
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${(progressPercent % maxLevel)/maxLevel * 100}%` }} />
        </div>
        {Math.round((progressPercent % maxLevel)/maxLevel * 100)}% Completed

        <div style={styles.tabs}>
        <button style={styles.tab(tab === "todo")} onClick={() => setTab("todo")}>To Do</button>
        <button style={styles.tab(tab === "done")} onClick={() => setTab("done")}>Done</button>
        <button style={styles.tab(tab === "skipped")} onClick={() => setTab("skipped")}>Skipped</button>
        </div>
        {routineData.map((section) => {

            // Filter items based on tab
            const filteredItems = section.items.filter((item) => {
                if (tab === "todo") return !state[item.label] && !skippedState[item.label];
                if (tab === "done") return state[item.label];
                if (tab === "skipped") return skippedState[item.label];
                return false;
            });

            // If "todo", only take first 3
            const visibleItems = tab === "todo" ? filteredItems.slice(0, 3) : filteredItems;

            return (
                <div key={section.section}>
                <h2>{section.section}</h2>

                {visibleItems.map((item) => {
                    const key = item.label;

                    return (
                        <div key={key} style={styles.card}>
                        <div>
                        <div>{item.label}</div>
                        {item.type === "time" && <div style={styles.subtitle}>{item.value}</div>}
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
            );
        })}
        </div>
    );
}
