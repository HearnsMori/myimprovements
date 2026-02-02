//ToDo:
//Fix Level System
//Add More and Research More To Consumeable
//Routine Info
//
//
//
"use client";
import Plan from "./plan/page";
import { useEffect, useState, useCallback} from "react";

//Pattern for Improvements (Pattern When To Execute) (How)
//5m work for 20m for free time
//for every 3hrs, HIT before healthy plate meal/snacks then post-meal Exercise
//Drink less than 1/4 water every 15m for hydration
//Amethyst routine
//Facial routine for morning and night
//Environment cleaning routine
//Shower routine
//Brush teeth
//Trimming routine
//Daily Probiotics

type RoutineItemNoId = | { label: string; type: "done"; id?: string } | {label: string; type: "energy"; id?: string; name: string; time: number };
type RoutineItem = | { label: string; type: "done"; id: string } | { label: string; type: "energy"; id: string; name: string; time: number };
type RoutineSectionNoId = {
    section: string;
    items: RoutineItemNoId[];
};

type RoutineSection = {
    section: string;
    items: RoutineItem[];
};

type RoutineInfo = {
    title: string;
    how: string;
};

interface Varen {
    name: string;
    id: string;
    time: number; // Time in minutes or seconds, based on your requirement
};

const STORAGE_KEY = "daily-routine-progress";
const SKIPPED_KEY = "daily-routine-skipped";
const STORAGE_KEY_PAST = "daily-routine-progress-past";
const SKIPPED_KEY_PAST = "daily-routine-skipped-past";
const DATE_KEY = "daily-routine-date";
const STREAK_KEY = "daily-routine-streak";

const routineInfo: RoutineInfo[] = [
    {
        title: "Amethyst Routine",
        how:`
        Be stomeone who is emotionally steady and calm,
        who doesn’t pressure her for attention, answers,
        or reassurance, who is reliably there, and whose
        mood and sense of self don’t rise or fall based on
        how she responds — while still being kind, warm, and
        fully present whenever she chooses to connect.
        `,

    },
    {
        title: "Mori Facial Skin Routine",
        how: `
        For Morning:
        Wash Face,
        Use Facial Cleanser,
        Apply Vitamin C Serum,
        Use Moisturizer,
        Apply Sunscreen,
        
        For Evening:
        Wash Face,
        Use Facial Cleanse,
        Use Moisturizer,
        Retinoids,
        Apply Sunscreen,
        Apply Jojoba Oil and Use Jade Roller,
        Other Hygiene,
        `,

    },
    {
        title: "Mori Shower w/ FaceExer Routine",
        how: `
        Get wet,
        Shampoo,
        Conditioner,
        Soap,
        Gentle Rub,
        Chick Lift Exercise,
        Eyebrow Eye Close Exercise,
        Rinse Water,
        `,
    },
    
];
/*5yy
    {
        title: "Mori Facial Skin Routine",
        how: `
        `,
    },
*/

const rankingData = [
    { level: 0,  name: "unalive", image: "level0.png" },

    { level: 1,  name: "worm", image: "level3.png" },
    { level: 2,  name: "fish", image: "level4.png" },
    { level: 3,  name: "dog", image: "level5.png" },
    { level: 4,  name: "monkey", image: "level6.png" },

    { level: 5,  name: "borderline", image: "level9.png" },
    { level: 6, name: "extremely below average", image: "level10.png" },
    { level: 7, name: "below average", image: "level11.png" },
    { level: 8, name: "barely average", image: "level12.png" },

    { level: 9, name: "close average", image: "level13.png" },
    { level: 10, name: "average", image: "level14.png" },
    { level: 11, name: "average (good)", image: "level15.png" },
    { level: 12, name: "average (high)", image: "level17.png" },

    { level: 13, name: "above average", image: "level19.png" },
    { level: 14, name: "above average (good)", image: "level22.png" },
    { level: 15, name: "above average (high)", image: "level24.png" },
    { level: 16, name: "highly above average", image: "level25.png" },

    { level: 17, name: "almost gifted", image: "level26.png" },
    { level: 18, name: "gifted", image: "level28.png" },
    { level: 19, name: "genius", image: "level31.png" },
    { level: 20, name: "elite", image: "level32.png" },

    { level: 21, name: "one of hundred millions", image: "level34.png" },
    { level: 22, name: "one of billions", image: "level34.png" },
    { level: 23, name: "one of ten billions", image: "level34.png" },
    { level: 24, name: "perfection", image: "level37.png" }
];

/* for face
1. Sun Protection, Retinoids, Cleanser, Moisturizer, Vitamin C Serum, Exfoliation, Jojoba Oil w/ Massage
2. Clean Self and Environment, Avoid Smoke/Pollutant
3. Balance Diet w/ Antioxidants, Fiber, & Vitamin A
eat slowly and chew
Pre-meal HIIT/strength
post-meal
diaphragm breathing +
as much movement as possible without
disrupting breathing nor shaking stomach

4. Hydration
5. Quality Sleep
6. Positive Emotion & Anti-stress
7. Exercise
*/


/*
Effort Offered / Respect Autonomy (Her Ability to Choose)
Emotional Security and Validation
Identity Support even in just mid way
During Hard Times Show Love Consistency
Repair Problem Fast
Transparency
Love in a way she is capable of receiving (over than she can receive can sometimes feel guilt)
Dont Make Her Feel Pressure for Regulating Her/My Self
Unconditional Love
Express Gratitude
Show Progress6
Reduce Decision
Novelty
Safe Unknown
*/

const routineDataNoId: RoutineSectionNoId[] = [
    {
        section: "Identity",
        items: [
            { label: "Mori Computer Science Routine: +5 mins", type: "energy", name: "Free time", time: 20},
        ],
    },
    {
        section: "Make Amethyst Feels Good (Maximize)",
        items: [
            { label: "Amethyst Routine", type: "energy", name: "Amethyst", time: 60 },
            { label: "Morning: Offer Effort (Respect Autonomy; Her capability to choose)", type: "done" },
            { label: "Morning: Identity Support (even mid way)", type: "done" },
            { label: "Morning: Reduce Decision", type: "done" },
            { label: "Morning: Safe Unknown (Light Curiousity)", type: "done" },
            { label: "Afternoon: Don\'t give responsibility (example to regulate my emotion)", type: "done" },
            { label: "Afternoon: Love in the way she\'s capable of receiving", type: "done" },
            { label: "Afternoon: Transparency", type: "done" },
            { label: "Afternoon: During Hard Times: Show Love Consistency", type: "done" },
            { label: "Evening: Emotional Security & Validation", type: "done" },
            { label: "Evening: Unconditional Love", type: "done" },
            { label: "Evening: Repair Problems Fast", type: "done" },
            { label: "Evening: Express Gratitude", type: "done" },
            { label: "Night: Show Progress", type: "done" },
            { label: "Night: Novelty", type: "done" },
            { label: "Night: Safe Unknown (Deeper than Morning)", type: "done" },
        ],
    },
    {
        section: "Mouth&Nose Consumeable",
        items: [
            { label: "Drink 1/8 Glass", type: "energy", name: "Hydration", time: 16 },
            { label: "Mori Properly-Form Diaphragm Positivity Walking Meditation: +5m", type: "energy", name: "Rest", time: 40 },
            { label: "Mori Meal/Snack Routine", type: "energy", name: "Meal/Snack", time: 3*65 },
            
            { label: "Brush Teeth Routine", type: "energy", name: "Tooth Hygiene", time: 12*60 },
            { label: "Probiotics", type: "done" },

        ],
    },
    {
        section: "Skin Consumeable",
        items: [
            { label: "Clean Environment", type: "energy", name: "Environment hygiene", time: 12*60 },
            { label: "Mori Facial Skin Routine", type: "energy", name: "Face hygiene", time: 12*60 },
            { label: "Mori Shower w/ FaceExer Routine", type: "energy", name: "Shower hygiene", time: 24*60 },
        ],
    },
    {
        section: "Eyes&Ears Consumeable",
        items: [
            { label: "Mori E&E Learn Routine: +5m", type: "energy", name: "Knowledge", time: 3*60 },
        ],
    },
    {
        section: "Nerve&Mind&Muscle Consumeable",
        items: [
            { label: "Mori Sleep Routine: +30m", type: "energy", name: "Sleep hygiene", time: 60},
            { label: "Mori Properly-Form Diaphragm Positivity Walking Meditation Routine: +5m", type: "energy", name: "Rest", time: 30 },
            
            { label: "Mori Exercise Routine", type: "energy", name: "Exercise", time: 12*60 },
            { label: "Mori Neck Exercise Routine", type: "energy", name: "Exercise", time: 12*60 },
            { label: "Play 30m Chess", type: "energy", name: "Chess", time: 12*60 },
            { label: "Play Music: +5m", type: "energy", name: "Music", time: 1*60 },
        ],
    },
    //==============
    //Not to do list
    //==============
    {
        section: "#Mouth&Nose Consumeable",
        items: [
            { label: "Oily/Processed(such as Processed Sugar)/High Salt/Unhealthy Food", type: "energy", name: "Free time", time: -10 },
        ]
    },
    {
        section: "#Skin Consumeable",
        items: [
            { label: "Touching Skin by Self/Smoke/Sweats/Environment: +5m", type: "energy", name: "Free time", time: -5 },
        ]
    },
    {
        section: "#Eyes&Ears Consumeable",
        items: [
            { label: "Many Useless Information", type: "energy", name: "Free time", time: -10 },
        ]
    },
    {
        section: "#Nerve&Mind&Muscle Consumeable",
        items: [
            { label: "$Physical Harm", type: "energy", name: "Free time", time: -20},
            { label: "$Negetivity", type: "energy", name: "Free time", time: -20 },
        ]
    },
];
const totalEnergyItems = 13;

function addUniqueIdsToRoutine(data: RoutineSectionNoId[]): any {
    return data.map((section, sectionIndex) => ({
        ...section,
        items: section.items.map((item, itemIndex) => ({
            ...item,
            id: `${sectionIndex}-${itemIndex}-${item.label.replace(/\s+/g, '-')}` // unique id
        }))
    }));
}

const routineData: RoutineSection[] = addUniqueIdsToRoutine(routineDataNoId);

type CounterData = {
  value: number;
  lastUpdated: number; // timestamp in ms
};

export default function DailyRoutine() {
    const [state, setState] = useState<Record<string, boolean>>({});
    const [skippedState, setSkippedState] = useState<Record<string, boolean>>({});
    const [pastState, setPastState] = useState<Record<string, boolean>>({});
    const [pastSkippedState, setPastSkippedState] = useState<Record<string, boolean>>({});
    const [tab, setTab] = useState<"todo" | "done" | "skipped" | "nottodo" | "plan">("todo");
    const [streak, setStreak] = useState<number>(0);
    const [correct, setCorrect] = useState<number>(0);
    const LOCAL_FOR_VAREN = "LOCAL_FOR_VAREN";
    const LOCAL_LAST_TIME = "LOCAL_LAST_TIME";
    const [varen, setVaren] = useState<Varen[]>([]);
    // Effect to sync state to localStorage whenever the items array changes
    useEffect(() => {
        const savedItems = localStorage.getItem(LOCAL_FOR_VAREN);
        if (varen.length === 0 && savedItems && savedItems !== "undefined") {
            setVaren(JSON.parse(savedItems));
        }
    }, []);
    useEffect(() => {
        // localStorage only stores strings, so we use JSON.stringify()
        //alert(JSON.stringify(varen));
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_FOR_VAREN, JSON.stringify(varen));
            alert(LOCAL_FOR_VAREN);
        }
    }, [varen]); // This runs whenever 'items' is updated
    // Effect to decrase the time by 1 every minute
    useEffect(() => {
        const now = Date.now();
        const stored = localStorage.getItem(LOCAL_LAST_TIME);

        // First ever run initialize and exit
        if (!stored || stored === "undefined") {
            localStorage.setItem(LOCAL_LAST_TIME, String(now));
            return;
        }

        const lastUpdate = Number(stored) || now;

        const minutesPassed = Math.floor((now - lastUpdate) / 60000);
        if (minutesPassed <= 0) return;
        setVaren(prevItems => {
            return prevItems.map(item => ({
                ...item,
                time: Math.max(0, item.time - minutesPassed),
            }));
        });

        localStorage.setItem(LOCAL_LAST_TIME, String(now));
    }, []);

    // Function to add a new JSON object to the array
    const addVaren = useCallback((name: string, initialTime: number) => {
        //alert(JSON.stringify(varen));
        setVaren(prev => {
            let found = false;
            const updated = prev.map(item => {
                if (item.name === name) {
                    found = true;
                    return { ...item, time: item.time + initialTime };
                }
                return item;
            });
            if (!found) {
                return [
                    ...updated,
                    {
                        name,
                        id: crypto.randomUUID(), // better than Math.random
                        time: initialTime
                    }
                ];
            }
            return updated;
        });
        if (typeof window !== 'undefined') {
            alert(LOCAL_FOR_VAREN);
            localStorage.setItem(LOCAL_FOR_VAREN, JSON.stringify(varen));
        }
    }, []);

    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        const savedCount = Number(localStorage.getItem("free"));
        if(count === null) {
            if(savedCount) {
                setCount(savedCount);
            } else {
                setCount(0);
            }
        } else {
            localStorage.setItem("free", String(count));
        }
        const now = Date.now();
        const saved = localStorage.getItem("Count");
        if (!count) return;
        if (saved) {
            const data: CounterData = JSON.parse(saved);

            // how many full minutes passed
            const minutesPassed = Math.floor(
                (now - data.lastUpdated) / (60 * 1000)
            );

            const newValue = count - minutesPassed;
            if (newValue < 0) {
                setCount(0); 
            } else {
                setCount(newValue);
            }
            // save updated state
            localStorage.setItem(
                "Count",
                JSON.stringify({
                    value: newValue,
                    lastUpdated: now,
                })
            );
        } else {
            // initial value
            const initialValue = count;

            localStorage.setItem(
                "Count",
                JSON.stringify({
                    value: initialValue,
                    lastUpdated: now,
                })
            );
        }
    }, [count]);


    useEffect(()=>{
        const saved = Number(localStorage.getItem("correct"));
        if (saved && correct === 0) {
            setCorrect(saved);
        } else if (saved && correct !== 0) {
            localStorage.setItem("correct", String(correct));
            setCorrect(correct);
        } else {
            localStorage.setItem("correct", String(correct));
            setCorrect(correct);
        }
        //localStorage.clear();
    }, [correct]);

    const [showPlan, setShowPlan] = useState<boolean>(true);
    //For visible section
    const [openSection, setOpenSection] = useState<string>("Sleep");

    //For level up effect
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
    const [leveledUpRank, setLeveledUpRank] = useState<typeof rankingData[number] | null>(null);
    const [leveledUpRankPast, setLeveledUpRankPast] = useState<typeof rankingData[number] | null>(null);
    const [pastLevel, setPastLevel] = useState<number>(0);
    const [pastProgressPercent, setPastProgressPercent] = useState<number>(0);
    const [pastRank, setPastRank] = useState<typeof rankingData[number] | null>(null);

    //Math
    const [challengeTaskId, setChallengeTaskId] = useState<string | null>(null);
    const [challengeA, setChallengeA] = useState<number>(0);
    const [challengeB, setChallengeB] = useState<number>(0);
    const [challengeC, setChallengeC] = useState<number>(0);
    const [challengeD, setChallengeD] = useState<number>(0);
    const [challengeAnswer, setChallengeAnswer] = useState<string>("");
    const [challengeStep, setChallengeStep] = useState<number>(0);
    const [challengeError, setChallengeError] = useState<string | null>(null);

    const [randomPercent, setRandomPercent] = useState<number>(0);
    
    const [routineInfoIndex, setRoutineInfoIndex] = useState<number>(0);

    const randomDigit = (min: number, max: number) => Math.floor(min/*Minimum*/ + Math.random() * (max-min));

    // Calculate progress
    const totalTasks = routineData.reduce((sum: number, section: RoutineSection) => sum + section.items.length, 0);
    const dsTasks = Math.max(
        0,
        Object.values(state).filter(Boolean).length + (Object.values(skippedState).filter(Boolean).length / 2) - correct
    );
    const MAX_LEVEL = 24;
    const MAX_PER_SEC = 500000;
    const maxLevel = 100/MAX_LEVEL;
    const exponent = 0.48;
    const progressPercent = 100 * Math.pow(dsTasks / totalTasks, exponent);

    // Level
    const level = Math.min(
        MAX_LEVEL,
        Math.max(0, Math.floor(progressPercent / maxLevel))
    );

    const levelNotRound = Math.min(
        MAX_LEVEL,
        Math.max(0, progressPercent / maxLevel)
    );

    function percentTo8PM(input: number): number {
        const date: Date = new Date();
        const hours =
            date.getHours() +
            date.getMinutes() / 60 +
            date.getSeconds() / 3600;
        const out = input * ((Math.max(Math.min(hours, 20), 4)-4)/16);
        //alert(input);
        //alert(out);
        return Math.round(out);
    }

    useEffect(() => {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem(DATE_KEY);
        const savedStreak = Number(localStorage.getItem(STREAK_KEY) || 0);

        let newStreak = 1;

        if (savedDate) {
            const diff =
                (new Date(today).getTime() - new Date(savedDate).getTime()) /
                (1000 * 60 * 60 * 24);
            if (diff === 1) {
                newStreak = savedStreak + 1;
                localStorage.setItem("pastLevel", String(level));
                localStorage.setItem("pastProgressPercent", String(progressPercent));
            } else if (diff > 1) {
                newStreak = 1;
            } else {
                newStreak = savedStreak;
            }
        }
        setStreak(newStreak);

        if (savedDate !== today) {
            const a = localStorage.getItem(STORAGE_KEY);
            const b = localStorage.getItem(SKIPPED_KEY);

            if (a) localStorage.setItem(STORAGE_KEY_PAST, a);
            if (b) localStorage.setItem(SKIPPED_KEY_PAST, b);

            localStorage.removeItem("correct");
            setVaren([]);
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
            setRandomPercent(Math.random()*100);
            const a = localStorage.getItem("pastLevel");
            const b = localStorage.getItem("pastProgressPercent");
            const saved = localStorage.getItem(STORAGE_KEY);
            const skipped = localStorage.getItem(SKIPPED_KEY);
            const pastSaved = localStorage.getItem(STORAGE_KEY_PAST);
            const pastSkipped = localStorage.getItem(SKIPPED_KEY_PAST);
            if (a) setPastLevel(Math.max(Number(a), 18));
            if (b) setPastProgressPercent(Number(b));
            if (saved) setState(JSON.parse(saved) as Record<string, boolean>);
            if (skipped) setSkippedState(JSON.parse(skipped) as Record<string, boolean>);
            if (pastSaved) setPastState(JSON.parse(pastSaved) as Record<string, boolean>);
            if (pastSkipped) setPastSkippedState(JSON.parse(pastSkipped) as Record<string, boolean>);

        }
    }, []);
    useEffect(() => {
        const rank = rankingData.find(r => r.level === percentTo8PM(pastLevel)) || null;
        setPastRank(rank);
    }, [pastLevel]);

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
        buttonGroup: { display: "flex", flexFlow: "column nowrap", gap: 15 },
    };

    return (
        <div style={styles.page}>
        {challengeTaskId && (
            <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba 0,0,0,0.85)",
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
                maxWidth: 320,
                width: "100%",
                textAlign: "center",

            }}
            >
            <h3 style={{ marginBottom: 8 }}>
            Solve to Unlock Task
            </h3>

            <p style={{ color: "#a1a1aa", marginBottom: 12 }}>
            Question {challengeStep} of 1
            </p>

            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {challengeA} × {challengeB} {/*+ {challengeC} - {challengeD}*/}
            </div>

            <input
            type="number"
            value={challengeAnswer}
            onChange={(e) => setChallengeAnswer(e.target.value)}
            style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "none",
                marginBottom: 10,
                fontSize: 16,
            }}
            />

            {challengeError && (
                <div style={{ color: "#ef4444", marginBottom: 10 }}>
                {challengeError}
                </div>
            )}

            <button
            onClick={() => {
                const correct = (challengeA * challengeB) /*+ challengeC - challengeD*/;
                if (Number(challengeAnswer) !== correct) {
                    setChallengeError("Wrong answer. Challenge reset.");
                    setChallengeStep(1);
                    setChallengeA(randomDigit(10,99));
                    setChallengeB(randomDigit(10,99));
                    setChallengeC(randomDigit(0,198));
                    setChallengeD(randomDigit(0,99));
                    setChallengeAnswer("");
                    return;
                }

                if (challengeStep === 1) {
                    // UNLOCK TASK
                    skip(challengeTaskId);
                    setChallengeTaskId(null);
                    return;
                }

                // Next question
                setChallengeStep((s) => s + 1);
                setChallengeError(null);
                setChallengeA(randomDigit(10,99));
                setChallengeB(randomDigit(10,99));
                setChallengeC(randomDigit(0,198));
                setChallengeD(randomDigit(0,99));
                setChallengeAnswer("");
            }}
            style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                backgroundColor: "#16a34a",
                color: "#fff",
                fontWeight: 700,
                width: "100%",
            }}
            >
            Submit
            </button>

            <button
            onClick={() => setChallengeTaskId(null)}
            style={{
                marginTop: 8,
                background: "none",
                border: "none",
                color: "#a1a1aa",
                cursor: "pointer",
            }}
            >
            Cancel
            </button>
            </div>
            </div>
        )}
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
        <h1>Daily Routine v4</h1>
        <div>
        <h2>Day Streak: {streak}</h2>
        {Array.isArray(varen) && varen.length > 0 && varen.map((varenItem) => {
            if (!varenItem?.name) return null;
            return (
                <h2 style={{
                    color: (varenItem.time === 0) ? "red" : "green",
                }} key={varenItem.id}>
                {varenItem.name}: {varenItem.time}m
                </h2>
            );
        })}
        <h5>Wrong: {correct}</h5>
        </div>
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

        Enemy Level: {`${percentTo8PM(pastLevel)}`}
        <br/>
        Enemy Status Rarity: {pastRank?.name}
        <br/>
        {/*Income per hour: {hourlySalary} Php*/}
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${randomPercent}%` }} />
        </div>

        {Math.round((progressPercent % maxLevel)/maxLevel * 100)}% Completed

        <div style={styles.tabs}>
        <button style={styles.tab(tab === "todo")} onClick={() => setTab("todo")}>To Do</button>
        <button style={styles.tab(tab === "done")} onClick={() => setTab("done")}>Done</button>
        <button style={styles.tab(tab === "skipped")} onClick={() => setTab("skipped")}>Skipped</button>
        </div>
        <div style={styles.tabs}>
        <button style={styles.tab(tab === "nottodo")} onClick={() => setTab("nottodo")}>Not To Do</button>
        <button style={styles.tab(tab === "plan")} onClick={() => setTab("plan")}>Routine How Info</button>
        </div> 
        {   
            routineData.map((section: RoutineSection, index, array) => {
                
                if (varen.length < totalEnergyItems) {
                    section.items.map(item => {
                        if(item.type === "energy") {
                            addVaren(item.name, 0);
                        }
                    });
                }

                const getSectionProgress = (section: RoutineSection) => {
                    const total = section.items.length;
                    const done = section.items.filter(i => state[i.id]).length;
                    const skip = section.items.filter(i => skippedState[i.id]).length;
                    return {
                        total,
                        done,
                        percent: total === 0 ? 0 : Math.round(((done+skip/2) / total) * 100),
                        completed: done === total && total > 0,
                    };
                };


                function CircleProgress({ percent }: { percent: number }) {
                    return (
                        <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: `conic-gradient(#16a34a ${percent * 3.6}deg, #27272a 0deg)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                        >
                        {percent}%
                        </div>
                    );
                }

                // Filter items based on tab
                const filteredItems = section.items.filter((item) => {
                    if (tab === "todo") return !state[item.id] && !skippedState[item.id];
                    if (tab === "nottodo") return !state[item.id] && !skippedState[item.id];
                    if (tab === "done") return state[item.id];
                    if (tab === "skipped") return skippedState[item.id];
                    return false;
                });

                // If "todo", only take first 3
                const visibleItems = (tab === "todo" || tab === "nottodo") ? filteredItems : filteredItems;
                const progress = getSectionProgress(section);
                if (tab === "todo" || tab === "done" || tab === "skipped") {
                    if(tab === "todo" && section.section.charAt(0) === '#') return;
                    return (
                        <div key={section.section}
                        style={{
                            marginBottom: "7vw",
                        }}>
                        <div>
                        <div
                        onClick={()=>{
                            if (openSection === section.section) {
                                setOpenSection("");
                            } else {
                                setOpenSection(section.section);
                            }
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            position: "relative",
                        }}
                        >
                        <div style={{ maxWidth: "73vw", fontSize: 16, fontWeight: 700, color: section.section === openSection ? "white" : "gray" }}>
                        {section.section}
                        </div>

                        {/*<CircleProgress percent={progress.percent} />*/}

                        {progress.completed && (
                            <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: "50%",
                                height: 2,
                                backgroundColor: "#16a34a",
                                opacity: 0.6,
                            }}
                            />
                        )}
                        </div>
                        </div>


                        {visibleItems.map((item, index) => {
                            if(section.section !== openSection) {
                                return;
                            }
                            const key = item.id;

                            return (
                                <div key={key} style={styles.card}>
                                <div>
                                <div>{item.label}</div>
                                </div>

                                <div style={styles.buttonGroup}>

                                {tab && item.type == "energy" && (
                                    <button
                                    onClick={() => {
                                        // If the object is found, update its time property
                                        addVaren(item.name, item.time);
                                        //alert(item.name+item.time);
                                    }}
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
                                    +
                                        </button>
                                )}
                                {tab && item.type !== "energy" && item.label.charAt(0) !== '$' && section.section.charAt(0) !== '!' && (
                                    <button
                                    onClick={() => {
                                        toggle(key);
                                    }}
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

                                {tab !== "done"  && item.type !== "energy" &&  item.label.charAt(0) !== '$' && (
                                    <button
                                    onClick={() => {
                                        setChallengeTaskId(key);
                                        setChallengeA(randomDigit(10,99));
                                        setChallengeB(randomDigit(10,99));
                                        setChallengeC(randomDigit(0,198));
                                        setChallengeD(randomDigit(0,99));
                                        setChallengeAnswer("");
                                        setChallengeStep(1);
                                        setChallengeError(null);
                                    }}
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
                                {tab !== "done"  && item.type === 'energy' && (
                                    <button
                                    onClick={() => {
                                        addVaren(item.name, item.time*-1);
                                    }}
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
                                    -
                                        </button>
                                )}


                                </div>
                                </div>
                            );
                        })}
                        </div>
                    );
                } else if (tab === "nottodo") {
                    if(section.section.charAt(0) !== '#') return;
                    return (
                        <div key={section.section}
                        style={{
                            marginBottom: "7vw",
                        }}>
                        <div>
                        <div
                        onClick={()=>{
                            if (openSection === section.section) {
                                setOpenSection("");
                            } else {
                                setOpenSection(section.section);
                            }
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            position: "relative",
                        }}
                        >
                        <div style={{ maxWidth: "73vw", fontSize: 16, fontWeight: 700, color: section.section === openSection ? "white" : "gray" }}>
                        {section.section}
                        </div>

                        <CircleProgress percent={progress.percent} />

                        {progress.completed && (
                            <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: "50%",
                                height: 2,
                                backgroundColor: "#16a34a",
                                opacity: 0.6,
                            }}
                            />
                        )}
                        </div>
                        </div>


                        {visibleItems.map((item, index) => {
                            if(section.section !== openSection) {
                                //alert("hi");
                                return;
                            }
                            const key = item.id;

                            return (
                                <div key={key} style={styles.card}>
                                <div>
                                <div>{item.label}</div>
                                </div>

                                <div style={styles.buttonGroup}>
                                
                                {tab && item.type == "energy" && (
                                    <button
                                    onClick={() => {
                                        // If the object is found, update its time property
                                        addVaren(item.name, item.time);
                                        //alert(item.name+item.time);
                                    }}
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
                                    +
                                        </button>
                                )}

                                </div>
                                </div>
                            );
                        })}
                        </div>
                    );
                } else if (tab === "plan" && index === 0) {
                    return routineInfo.map((info, index2) => {

                        return (
                        <div key={index2}>
                        <h2
                        onClick={(e) =>
                            setRoutineInfoIndex(
                                routineInfoIndex === index2 ? 0 : index2
                            )
                        }
                        >
                        {info.title}
                        </h2>

                        {index2 === routineInfoIndex && (
                            <p style={{ fontSize: 17 }}>
                            {info.how}
                            </p>
                        )}
                        </div>
                        );
                    })
                } else {
                    return;
                }
            })}
            </div>
    );
}
