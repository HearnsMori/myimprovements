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

const rankingData = [
    { level: 0,  name: "zero", image: "level0.png" },
    { level: 1,  name: "far below average", image: "level3.png" },
    { level: 2,  name: "below average (low)", image: "level4.png" },
    { level: 3,  name: "below average", image: "level5.png" },
    { level: 4,  name: "below average (high)", image: "level6.png" },

    { level: 5,  name: "lower normal", image: "level9.png" },
    { level: 6, name: "low average", image: "level10.png" },
    { level: 7, name: "low average (stable)", image: "level11.png" },
    { level: 8, name: "low average (strong)", image: "level12.png" },

    { level: 9, name: "barely average", image: "level13.png" },
    { level: 10, name: "almost average", image: "level14.png" },
    { level: 11, name: "average (low)", image: "level15.png" },
    { level: 12, name: "average (low-mid)", image: "level17.png" },
    { level: 13, name: "average (mid)", image: "level19.png" },
    { level: 14, name: "average (mid-high)", image: "level22.png" },
    { level: 15, name: "average (high)", image: "level24.png" },
    { level: 16, name: "almost above average", image: "level25.png" },

    { level: 17, name: "above average", image: "level26.png" },
    { level: 18, name: "advanced", image: "level28.png" },
    { level: 19, name: "exceptional advanced", image: "level31.png" },

    { level: 20, name: "elite", image: "level32.png" },
    { level: 21, name: "master", image: "level34.png" },
    
    { level: 22, name: "above genius", image: "level34.png" },
    { level: 23, name: "top genius", image: "level34.png" },

    { level: 24, name: "one of the most influencial", image: "level37.png" }
];

const routineDataNoId: RoutineSection[] = [
    {
        section: "DAILY ROUTINE",
        items: [
            //============
            //4hrs - 1
            //============
            { label: "Sleep Total 1hrs", type: "done" },
            { label: "Sleep Total 2hrs", type: "done" },
            { label: "Sleep Total 3hrs", type: "done" },
            { label: "Sleep Total 4hrs", type: "done" },

            //============
            //4hrs - 2
            //============
            { label: "Sleep Total 5hrs", type: "done" },
            { label: "Sleep Total 6hrs", type: "done" },
            { label: "Sleep Total 7hrs", type: "done" },
            { label: "Sleep Total 8hrs", type: "done" },
            { label: "Sleep in Back (Did You?)", type: "done" },

            //============
            //4hrs - 3
            //============
            
            //First thing to do
            { label: "Make Amethyst Morning Feels Good", type: "done" },
            { label: "Express Gratitude to Amethyst through Transparency", type: "done" },
            { label: "Clean-up the Bed", type: "done" },
            { label: "Drink 1 Glass", type: "count", unit: "glass" },

            //Getting ready
            { label: "Warm-up 7mins", type: "done" },
            { label: "Expose to Light (Indirect: Open Window)", type: "done" },

            //Hygiene
            { label: "Brush Teeth", type: "done" },
            { label: "Wash Face", type: "done" },
            { label: "Use Celeteque Brightening Facial Cleanser", type: "done" },
            { label: "Apply Jojoba Oil and Use Jade Roller Very Lightly for 10m", type: "done" },
            { label: "Apply Vitamin C Serum", type: "done" },
            { label: "Apply Celeteque Skin Defense", type: "done" },
            
            //Reflection
            { label: "Correct the Daily Routine for 30m", type: "done" },
            
            //Gut Health
            { label: "Drink 1 Glass", type: "count", unit: "glass" },
            { label: "Drink Probiotics", type: "count", unit: "glass" },
            
            //Hobby
            { label: "Play Guitar for 15mins", type: "done" },
            { label: "Play Guitar for 15mins", type: "done" },
            
            //Snacks
            { label: "Light Snack (A piece of fruit like banana or apple)", type: "done" },
            
            //Hobby
            { label: "Play Music for 15mins", type: "done" },
            { label: "Play Music for 15mins", type: "done" },

            //Facial Appearance + Bed Hygiene
            { label: "Warm-up Neck 2mins", type: "done" },

            { label: "Neck Curl Hand Resistance", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Curl Hand Resistance", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Curl Hand Resistance", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Curl Hand Resistance", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Tuck", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Tuck", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Tuck", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Neck Tuck", type: "done" },
            { label: "4-4-8 Breathing 1min", type: "done" },

            //Breakfast
            { label: "Eat Healthy (Focus: Fiber, Complex Carbs, Protein)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing", type: "done" },
            
            //Work plan
            { label: "Breakdown & Plan Work into 30m Block and SMART Task Prioritization for 15m", type: "done" },

            //============
            //4hrs - 4
            //============

            //Work
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Meditate for 10m", type: "done" },


            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Eat Healthy Snack", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },

            { label: "Make Amethyst Afternoon Feels Good", type: "done" },
            { label: "Show Progress to Amethyst through Novelty Preplan", type: "done" },
            
            //Warm-up
            { label: "Increase Heart Rate", type: "time", value: "3 mins" },
            { label: "Dynamic Mobility", type: "time", value: "7 mins" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },

            //Exercise
            { label: "Deep Squat", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Deep Squat", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Deep Squat", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Max Effort Pull", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Max Effort Pull", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Max Effort Pull", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },

            //============
            //4hrs - 5
            //============

            { label: "Planche Pushup 1 to L Sit 5s to Handstand 10s Set 1", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Planche Pushup 1 to L Sit 5s to Handstand 10s Set 1", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Planche Pushup 1 to L Sit 5s to Handstand 10s Set 1", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            
            //Cooldown
            { label: "Slowly Decrease Heart Rate", type: "time", value: "3 mins" },
            { label: "Static Stretch", type: "time", value: "7 mins" },

            
            { label: "Eat Healthy (Protein)", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },

            //Hygiene + Food
            { label: "Take Shower", type: "done" },
            { label: "Exercise Chick Lifter Focus on Resistance", type: "done" },
            { label: "Exercise Eyebrow Lifter Focus on Resistance", type: "done" },
            { label: "Exercise Chick Lifter Focus on Resistance", type: "done" },
            { label: "Exercise Eyebrow Lifter Focus on Resistance", type: "done" },
            { label: "Exercise Chick Lifter Focus on Resistance", type: "done" },
            { label: "Exercise Eyebrow Lifter Focus on Resistance", type: "done" },
            { label: "Apply Jojoba Oil and Use Gua Sha Very Lightly for 10min", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Other Hygiene (Nails, Eyebrows, etc)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },

            //Work
            { label: "Work 30m", type: "done" },
            { label: "Eat Healthy Snack", type: "done" },
            { label: "Drink 1/2 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/2 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            
            //============
            //4hrs - 5
            //============
          
            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 10m", type: "done" },
            
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 10m", type: "done" },
            
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            
            //============
            //4hrs - 5
            //============

            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 10m", type: "done" },

            //Consume
            { label: "Eat Healthy (Veggies)", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },

            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 15m", type: "done" }, 

            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },

            //Total Water Drinked 9.00
            
            //============
            //4hrs - 6
            //============
            
            { label: "Work 30m", type: "done" },
            { label: "Meditate 10m", type: "done" },
            
            //Consume
            { label: "Eat Healthy (Veggies)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },

            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 15m", type: "done" },

            //Night Routine
            { label: "Clean Environment", type: "done" },
            { label: "Brush Teeth", type: "done" },
            { label: "Wash Face", type: "done" },
            { label: "Use Celeteque Brightening Facial Cleanses", type: "done" },
            { label: "Apply Jojoba Oil and Use Jade Roller Very Lightly for 10m", type: "done" },
            { label: "Apply Vitamin C Serum", type: "done" },
            { label: "Apply Celeteque Skin Defense", type: "done" },
            { label: "Other Hygiene (Nails, Eyebrows, etc)", type: "done" },

            //Her
            { label: "Make Amethyst Night Feels Good", type: "done" },
            { label: "Show Emotional Security to Amethyst but with Safe Unknown and Curiousity", type: "done" },

            { label: "Stretch + Diaphragm Breathing", type: "done" },
            { label: "Read Books Until Sleepy", type: "done" },
            { label: "Elevate Legs Until Sleepy", type: "done" },
        ],
    },
];

function addUniqueIdsToRoutine(data: RoutineSection[]): any {
    return data.map((section, sectionIndex) => ({
        ...section,
        items: section.items.map((item, itemIndex) => ({
            ...item,
            id: `${sectionIndex}-${itemIndex}-${item.label.replace(/\s+/g, '-')}` // unique id
        }))
    }));
}

const routineData = addUniqueIdsToRoutine(routineDataNoId);


export default function DailyRoutine() {
    const [state, setState] = useState<Record<string, boolean>>({});
    const [skippedState, setSkippedState] = useState<Record<string, boolean>>({});
    const [tab, setTab] = useState<"todo" | "done" | "skipped">("todo");
    const [streak, setStreak] = useState<number>(0);

    //For level up effect
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
    const [leveledUpRank, setLeveledUpRank] = useState<typeof rankingData[number] | null>(null);
    const [leveledUpRankPast, setLeveledUpRankPast] = useState<typeof rankingData[number] | null>(null);


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
            //Uncomment the two below when reset
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
    const totalTasks = routineData.reduce((sum: number, section: RoutineSection) => sum + section.items.length, 0);
    const completedTasks = Object.values(state).filter(Boolean).length;
    const MAX_LEVEL = 24;
    const MAX_PER_SEC = 500000;
    const maxLevel = 100/MAX_LEVEL;
    const exponent = 0.48;
    const progressPercent = 100 * Math.pow(completedTasks / totalTasks, exponent);

    // level
    const level = Math.min(
        MAX_LEVEL,
        Math.max(0, Math.floor(progressPercent / maxLevel))
    );

    const levelNotRound = Math.min(
        MAX_LEVEL,
        Math.max(0, progressPercent / maxLevel)
    );

    const levelToHourlySalary = (clevel: number) => {
        if (clevel === 1) return 0.000000025*60*60*24;
        if (clevel === 2) return 0.00000025*60*60*24;
        if (clevel === 3) return 0.0000025*60*60*24;
        if (clevel === 4) return 0.000025*60*60*24;
        if (clevel === 5) return 0.00025*60*60*24;
        if (clevel === 6) return 0.00125*60*60*24;
        if (clevel === 7) return 0.0025*60*60*24;
        if (clevel === 8) return 0.005*60*60*24;
        if (clevel === 9) return 0.01*60*60*24;
        if (clevel === 10) return 0.5*60*60*24;
        if (clevel === 11) return 1*60*60*24;
        if (clevel === 12) return 2.5*60*60*24;
        if (clevel === 13) return 5*60*60*24;
        if (clevel === 14) return 25*60*60*24;
        if (clevel === 15) return 50*60*60*24;
        if (clevel === 16) return 100*60*60*24;
        if (clevel === 17) return 200*60*60*24;
        if (clevel === 18) return 1500*60*60*24;
        if (clevel === 19) return 3500*60*60*24;
        if (clevel === 20) return 7500*60*60*24;
        if (clevel === 21) return 60000*60*60*24;
        if (clevel === 22) return 120000*60*60*24;
        if (clevel === 23) return 250000*60*60*24;
        if (clevel === 24) return 500000*60*60*24;
    }

    // hourly salary
    const hourlySalary = levelToHourlySalary(level);

    useEffect(() => {
        if (level > currentLevel) {
            const rank = rankingData.find(r => r.level === level) || null;
            const rank2 = rankingData.find(r => r.level === level-1) || null;
            setCurrentLevel(level);
            setLeveledUpRank(rank);
            setLeveledUpRankPast(rank2);
            setShowLevelUp(true);
        }
    }, [level]);


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
        {showLevelUp && leveledUpRank && (
            <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            >
            <div
            style={{
                backgroundColor: "#18181b",
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                maxWidth: 320,
                width: "100%",
            }}
            >
            <h2 style={{ color: "#16a34a", marginBottom: 8 }}>
            Congratulations
            </h2>

            <p style={{ fontSize: 18, fontWeight: 600 }}>
            You reached Level {leveledUpRank?.level}
            </p>

            <p style={{ color: "#a1a1aa", marginBottom: 16 }}>
            {leveledUpRankPast?.name}=&gt;{leveledUpRank?.name}
            </p>

            <img
            src={`/levels${leveledUpRank.level}.jpeg`}
            alt={leveledUpRank?.name}
            style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                marginBottom: 16,
            }}
            />

            <button
            onClick={() => setShowLevelUp(false)}
            style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                backgroundColor: "#16a34a",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                width: "100%",
            }}
            >
            Continue
            </button>
            </div>
            </div>
        )}
        <h1>Daily Routine</h1>
        Day Streak: {streak}
        <br/>
        <br/>
        Level: {`${level}`}
        <br/>
        Status Rarity: {leveledUpRank?.name}
        <br/>
        {/*Income per hour: {hourlySalary} Php*/}
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
                if (tab === "todo") return !state[item.id] && !skippedState[item.id];
                if (tab === "done") return state[item.id];
                if (tab === "skipped") return skippedState[item.id];
                return false;
            });

            // If "todo", only take first 3
            const visibleItems = tab === "todo" ? filteredItems.slice(0, 3) : filteredItems;

            return (
                <div key={section.section}>
                <h2>{section.section}</h2>

                {visibleItems.map((item, index) => {
                    const key = item.id;

                    return (
                        <div key={key} style={styles.card}>
                        <div>
                        <div>{item.label}</div>
                        {item.type === "time" && <div style={styles.subtitle}>{item.value}</div>}
                        </div>

                        <div style={styles.buttonGroup}>
                        {tab && (
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
