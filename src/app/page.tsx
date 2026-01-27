"use client";
import Plan from "./plan/page";
import { useEffect, useState } from "react";

type RoutineItemNoId = | { label: string; type: "done"; id?: string } | { label: string; type: "sets"; sets: number; record?: number; id?: string } | { label: string; type: "time"; value: string; id?: string } | { label: string; type: "options"; options: string[]; id?: string } | { label: string; type: "count"; unit: string; id?: string };
type RoutineItem = | { label: string; type: "done"; id: string } | { label: string; type: "sets"; sets: number; record?: number; id: string } | { label: string; type: "time"; value: string; id: string } | { label: string; type: "options"; options: string[]; id: string } | { label: string; type: "count"; unit: string; id: string };
type RoutineSectionNoId = {
    section: string;
    items: RoutineItemNoId[];
};

type RoutineSection = {
    section: string;
    items: RoutineItem[];
};

const STORAGE_KEY = "daily-routine-progress";
const SKIPPED_KEY = "daily-routine-skipped";
const STORAGE_KEY_PAST = "daily-routine-progress-past";
const SKIPPED_KEY_PAST = "daily-routine-skipped-past";
const DATE_KEY = "daily-routine-date";
const STREAK_KEY = "daily-routine-streak";

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

const routineDataNoId: RoutineSectionNoId[] = [
    {
        section: "!Condensly Touch it with all your soul and every self",
        items: [
            { label: "for 5 mins", type: "done" },
        ],
    },
    {
        section: "$To Be Corrected State",
        items: [
            { label: "Operation", type: "done" },
        ],
    },
    {
        section: "Total Sleep",
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
        ],
    },
    {
        section: "Morning Amethyst Routine",
        items: [
            //============
            //4hrs - 3
            //============
            //First thing to do
            { label: "Make Amethyst Morning Feels Good", type: "done" },
            { label: "Express Gratitude to Amethyst through Transparency", type: "done" },
        ],
    },
    {
        section: "Wake-up Routine",
        items: [
            { label: "Clean-up the Bed", type: "done" },
            { label: "Drink 1 Glass", type: "count", unit: "glass" },

            //Getting ready
            { label: "Jumping jack 3mins", type: "done" },
            { label: "Rotate joint 2mins", type: "done" },
            { label: "Dynamic stretch 2mins", type: "done" },
            { label: "Expose to Light (Indirect: Open Window)", type: "done" },
        ],
    },
    {
        section: "Face Routine",
        items: [
            //Hygiene
            { label: "Brush Teeth", type: "done" },
            { label: "Wash Face", type: "done" },
            { label: "Use Celeteque Brightening Facial Cleanser", type: "done" },
            { label: "Apply Jojoba Oil and Use Jade Roller Very Lightly for 10m", type: "done" },
            { label: "Apply Vitamin C Serum", type: "done" },
            { label: "Apply Celeteque Skin Defense", type: "done" },
        ],
    },
    {
        section: "Improving This App Routine",
        items: [
            //Reflection
            { label: "Correct the Daily Routine for 30m", type: "done" },
        ],
    },
    {
        section: "Probiotics Routine",
        items: [
            //Gut Health
            { label: "Drink 1 Glass", type: "count", unit: "glass" },
            { label: "Drink Probiotics", type: "count", unit: "glass" },
        ],
    },
    {
        section: "Hobby Routine",
        items: [
            //Hobby
            { label: "Play Chess/Music for 15mins", type: "done" },
            { label: "Play Chess/Music for 15mins", type: "done" },
        ],
    },
    {
        section: "Snack Routine",
        items: [
            //Snacks
            { label: "Light Snack (A piece of fruit like banana or apple)", type: "done" },
        ],
    },
    {
        section: "Hobby Routine 2",
        items: [
            //Hobby
            { label: "Play Chess/Music for 15mins", type: "done" },
            { label: "Play Chess/Music for 15mins", type: "done" },
        ],
    },
    {
        section: "Neck Routine",
        items: [
            //Facial Appearance + Bed Hygiene
            { label: "Warm-up Neck 2mins", type: "done" },

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
        ],
    },
    {
        section: "Meal Routine",
        items: [
            //Breakfast
            { label: "Eat Healthy (Focus: Fiber, Complex Carbs, Protein)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing", type: "done" },
        ],
    },
    {
        section: "Work Planning Routine",
        items: [
            //Work plan
            { label: "Breakdown & Plan Work into 30m Block and SMART Task Prioritization for 15m", type: "done" },
        ],
    },
    {
        section: "Work Routine",
        items: [
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
        ],
    },
    {
        section: "Snack Routine 2",
        items: [
            { label: "Eat Healthy Snack", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
        ],
    },
    {
        section: "Microwork Routine",
        items: [
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
        ],
    },
    {
        section: "Afternoon Amethyst Routine",
        items: [
            { label: "Make Amethyst Afternoon Feels Good", type: "done" },
            { label: "Show Progress to Amethyst through Novelty Preplan", type: "done" },
        ],
    },
    {
        section: "Exercise Routine",
        items: [
            //Warm-up
            { label: "Jumping jack 3mins", type: "done" },
            { label: "Rotate joint 2mins", type: "done" },
            { label: "Dynamic stretch 2mins", type: "done" },
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
        ],
    },
    {
        section: "Meal Routine 2",
        items: [
            { label: "Eat Healthy (Protein)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
        ],
    },
    {
        section: "Hygiene Routine",
        items: [
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
        ],
    },
    {
        section: "Microwork Routine 2",
        items: [
            //Work
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
        ],
    },
    {
        section: "Work Routine 2",
        items: [
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
            { label: "Eat Healthy (Protein)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },

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
        ],
    },
    {
        section: "Meal Routine 3",
        items: [
            //Consume
            { label: "Eat Healthy (Veggies)", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
        ],
    },
    {
        section: "Work Routine 3",
        items: [
            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "4-4-8 Breathing 1min", type: "done" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 10m", type: "done" }, 

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
        ],
    },
    {
        section: "Meal Routine 4",
        items: [
            //Consume
            { label: "Eat Healthy (Veggies)", type: "done" },
            { label: "Drink 1/4 Glass", type: "count", unit: "glass" },
            { label: "Walk while Diaphragm Breathing for 10m", type: "done" },
        ],
    },
    {
        section: "Microwork Routine 3",
        items: [
            //Work Cycle
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Drink 1/8 Glass", type: "count", unit: "glass" },
            { label: "Work 30m", type: "done" },
            { label: "Meditate 15m", type: "done" },
        ],
    },
    {
        section: "Face Routine 2",
        items: [
            //Night Routine
            { label: "Clean Environment", type: "done" },
            { label: "Brush Teeth", type: "done" },
            { label: "Wash Face", type: "done" },
            { label: "Use Celeteque Brightening Facial Cleanses", type: "done" },
            { label: "Apply Jojoba Oil and Use Jade Roller Very Lightly for 10m", type: "done" },
            { label: "Apply Vitamin C Serum", type: "done" },
            { label: "Apply Celeteque Skin Defense", type: "done" },
            { label: "Other Hygiene (Nails, Eyebrows, etc)", type: "done" },
        ],
    },
    {
        section: "Evening Amethyst Routine",
        items: [
            //Her
            { label: "Make Amethyst Night Feels Good", type: "done" },
            { label: "Show Emotional Security to Amethyst but with Safe Unknown and Curiousity", type: "done" },
        ],
    },
    {
        section: "Sleep Routine",
        items: [
            { label: "Stretch + Diaphragm Breathing", type: "done" },
            { label: "Read Books Until Sleepy", type: "done" },
            { label: "Elevate Legs Until Sleepy", type: "done" },
        ],
    },
    //==============
    //==============
    //Not to do list
    //==============
    //==============
    {
        section: "#Amethyst",
        items: [
            { label: "Do not cause her emotional harm or introduce negativity through my actions or words (for 12 AM to 8 AM)", type: "done" },
            { label: "Do not hide, distort, or lie about anything even small thoughts, feelings, or details (for 12 AM to 8 AM)", type: "done" },
            { label: "Do not run from, avoid, or suppress obstacles; face them directly and honestly (for 12 AM to 8 AM)", type: "done" },
            { label: "Do not cause her emotional harm or introduce negativity through my actions or words (for 8 AM to 4 PM)", type: "done" },
            { label: "Do not hide, distort, or lie about anything even small thoughts, feelings, or details (for 8 AM to 4 PM)", type: "done" },
            { label: "Do not run from, avoid, or suppress obstacles; face them directly and honestly (for 8 AM to 4 PM)", type: "done" },
            { label: "Do not cause her emotional harm or introduce negativity through my actions or words (for 4 PM to 12 AM)", type: "done" },
            { label: "Do not hide, distort, or lie about anything even small thoughts, feelings, or details (for 4 PM to 12 AM)", type: "done" },
            { label: "Do not run from, avoid, or suppress obstacles; face them directly and honestly (for 4 PM to 12 AM)", type: "done" },
        ],
    },
    {
        section: "#Breathing and Posture",
        items: [
            { label: "for 12 AM to 2 AM", type: "done" },
            { label: "for 2 AM to 4 AM", type: "done" },
            { label: "for 4 AM to 6 AM", type: "done" },
            { label: "for 6 AM to 8 AM", type: "done" },
            { label: "for 8 AM to 10 AM", type: "done" },
            { label: "for 10 AM to 12 PM", type: "done" },
            { label: "for 12 PM to 2 PM", type: "done" },
            { label: "for 2 PM to 4 PM", type: "done" },
            { label: "for 4 PM to 6 PM", type: "done" },
            { label: "for 6 PM to 8 PM", type: "done" },
            { label: "for 8 PM to 10 PM", type: "done" },
            { label: "for 10 PM to 12 AM", type: "done" },
        ],
    },
    {
        section: "#Do Not Be Unproductive",
        items: [
            { label: "for 12 AM to 2 AM", type: "done" },
            { label: "for 2 AM to 4 AM", type: "done" },
            { label: "for 4 AM to 6 AM", type: "done" },
            { label: "for 6 AM to 8 AM", type: "done" },
            { label: "for 8 AM to 10 AM", type: "done" },
            { label: "for 10 AM to 12 PM", type: "done" },
            { label: "for 12 PM to 2 PM", type: "done" },
            { label: "for 2 PM to 4 PM", type: "done" },
            { label: "for 4 PM to 6 PM", type: "done" },
            { label: "for 6 PM to 8 PM", type: "done" },
            { label: "for 8 PM to 10 PM", type: "done" },
            { label: "for 10 PM to 12 AM", type: "done" },
        ],
    },
    {
        section: "#Do Not Eat Oily or Sugary or Unhealthy Food",
        items: [
            { label: "for 12 AM to 2 AM", type: "done" },
            { label: "for 2 AM to 4 AM", type: "done" },
            { label: "for 4 AM to 6 AM", type: "done" },
            { label: "for 6 AM to 8 AM", type: "done" },
            { label: "for 8 AM to 10 AM", type: "done" },
            { label: "for 10 AM to 12 PM", type: "done" },
            { label: "for 12 PM to 2 PM", type: "done" },
            { label: "for 2 PM to 4 PM", type: "done" },
            { label: "for 4 PM to 6 PM", type: "done" },
            { label: "for 6 PM to 8 PM", type: "done" },
            { label: "for 8 PM to 10 PM", type: "done" },
            { label: "for 10 PM to 12 AM", type: "done" },
        ],
    },
];

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

    const randomDigit = (min: number, max: number) => Math.floor(min/*Minimum*/ + Math.random() * (max-min));

    // Calculate progress
    const totalTasks = routineData.reduce((sum: number, section: RoutineSection) => sum + section.items.length, 0);
    const dsTasks = correct + Object.values(state).filter(Boolean).length + (Object.values(skippedState).filter(Boolean).length / 2);
    const MAX_LEVEL = 24;
    const MAX_PER_SEC = 500000;
    const maxLevel = 100/MAX_LEVEL;
    const exponent = 0.48;
    const progressPercent = 100 * Math.pow(dsTasks / totalTasks, exponent);

    // level
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

    function openTermux() {
        // This URI scheme attempts to launch Termux
        window.location.href = 'termux://';
    }


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
        <h1>Daily Routine: {count} free mins</h1>
        Day Streak: {streak}
        <br/>
        <br/>
        Level: {`${level}`}
        <br/>
        Status Rarity: {leveledUpRank?.name}
        <br/>
        Total Corrected: {correct}
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
        <button style={styles.tab(tab === "plan")} onClick={() => setTab("plan")}>Plan</button>
        </div> 


        {
            routineData.map((section: RoutineSection, index, array) => {
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
                const visibleItems = (tab === "todo" || tab === "nottodo") ? filteredItems.slice(0, 3) : filteredItems;
                const progress = getSectionProgress(section);
                if (progress.percent === 100 && tab === "todo") return;
                if (tab === "todo" || tab === "done" || tab === "skipped") {
                    if(tab === "todo" && section.section.charAt(0) === '#') return;
                    return (
                        <div key={section.section} onClick={()=>setOpenSection(section.section)} style={{
                            marginBottom: "7vw",
                        }}>
                        <div>
                        <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            position: "relative",
                        }}
                        >
                        <div style={{ fontSize: 18, fontWeight: 700, color: section.section === openSection ? "white" : "gray" }}>
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
                                return;
                            }
                            const key = item.id;

                            return (
                                <div key={key} style={styles.card}>
                                <div>
                                <div>{item.label}</div>
                                {item.type === "time" && <div style={styles.subtitle}>{item.value}</div>}
                                </div>

                                <div style={styles.buttonGroup}>


                                {tab && section.section.charAt(0) !== '$' && section.section.charAt(0) !== '!' && (
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
                                {tab && section.section.charAt(0) === '$' && (
                                    <button
                                    onClick={() => {
                                        setCorrect(i=>i+1);
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
                                {tab && section.section.charAt(0) === '!' && (
                                    <button
                                    onClick={() => {
                                        setCount(i=>{
                                            if (i !== null) return (i+15);
                                            return i;
                                        });
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
                                    done
                                    </button>
                                )}


                                {tab !== "done"  && section.section.charAt(0) !== '$' &&  section.section.charAt(0) !== '!' && (
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
                                {tab !== "done"  && section.section.charAt(0) === '$' && (
                                    <button
                                    onClick={() => {
                                        setCorrect(i=>i-1);
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
                        <div key={section.section} onClick={()=>setOpenSection(section.section)} style={{
                            marginBottom: "7vw",
                        }}>
                        <div>
                        <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            position: "relative",
                        }}
                        >
                        <div style={{ fontSize: 18, fontWeight: 700, color: section.section === openSection ? "white" : "gray" }}>
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
                                {item.type === "time" && <div style={styles.subtitle}>{item.value}</div>}
                                </div>

                                <div style={styles.buttonGroup}>
                                {tab && (
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
                                    Done
                                    </button>
                                )}

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

                                </div>
                                </div>
                            );
                        })}
                        </div>
                    );
                } else if (tab === "plan" && index === 0) {
                    window.location.href = "plan";
                } else {
                    return;
                }
            })}
            </div>
    );
}


