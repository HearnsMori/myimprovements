"use client";

import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

type Task = {
    id: string;
    title: string;

    // SMART
    specific: boolean;
    measurable: boolean;
    achievable: boolean;
    relevant: boolean;
    timeBound: boolean;

    // PRIORITY
    impact: number;
    urgency: number;
    effort: number;

    createdAt: number;
};

type Block30 = {
    id: string;
    label: string;
    tasks: Task[];
};

/* ================= HELPERS ================= */

const uid = () => crypto.randomUUID();

const priorityScore = (t: Task) =>
(t.impact * 2 + t.urgency * 1.5) / Math.max(t.effort, 1);

const defaultTask = (): Task => ({
    id: uid(),
    title: "Task",
    specific: false,
    measurable: false,
    achievable: false,
    relevant: false,
    timeBound: false,
    impact: 3,
    urgency: 3,
    effort: 3,
    createdAt: Date.now(),
});

const createBlock = (label = "Block"): Block30 => ({
    id: uid(),
    label,
    tasks: [],
});

const generateInitialBlocks = (): Block30[] => {
    const blocks: Block30[] = [];
    let hour = 6;
    let min = 0;

    for (let i = 0; i < 24; i++) {
        const start = `${String(hour).padStart(2, "0")}:${min === 0 ? "00" : "30"}`;
        min += 30;
        if (min === 60) {
            min = 0;
            hour++;
        }
        const end = `${String(hour).padStart(2, "0")}:${min === 0 ? "00" : "30"}`;

        blocks.push({
            id: uid(),
            label: `${start} – ${end}`,
            tasks: [],
        });
    }

    return blocks;
};

/* ================= PAGE ================= */

export default function PlannerPage() {
    const [blocks, setBlocks] = useState<Block30[]>([]);
    const [confirm, setConfirm] = useState<null | (() => void)>(null);

    const hasLoaded = useRef(false);

    /* ===== LOAD ONCE ===== */
    useEffect(() => {
        const saved = localStorage.getItem("planner_blocks");
        if (saved) {
            setBlocks(JSON.parse(saved));
        } else {
            setBlocks(generateInitialBlocks());
        }
        hasLoaded.current = true;
    }, []);

    /* ===== AUTO SAVE (SAFE) ===== */
    useEffect(() => {
        if (!hasLoaded.current) return;
        localStorage.setItem("planner_blocks", JSON.stringify(blocks));
    }, [blocks]);

    /* ===== MUTATORS ===== */

    const updateTask = (blockId: string, taskId: string, patch: Partial<Task>) =>
    setBlocks((prev) =>
              prev.map((b) =>
                       b.id !== blockId
                           ? b
                           : {
                               ...b,
                               tasks: b.tasks.map((t) =>
                                                  t.id === taskId ? { ...t, ...patch } : t
                                                 ),
                           }
                      )
             );

             const deleteTask = (blockId: string, taskId: string) =>
             setBlocks((prev) =>
                       prev.map((b) =>
                                b.id !== blockId
                                    ? b
                                    : { ...b, tasks: b.tasks.filter((t) => t.id !== taskId) }
                               )
                      );

                      const deleteBlock = (blockId: string) =>
                      setBlocks((prev) => prev.filter((b) => b.id !== blockId));

                      const addBlock = () =>
                      setBlocks((prev) =>
                                prev.length === 0 ? [createBlock()] : [...prev, createBlock()]
                               );

                               /* ================= UI ================= */

                               return (
                                   <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 16 }}>

                                   <button onClick={(e) => window.location.href = "../"} style={{ marginBottom: 16, marginRight: 16, }}>
                                   Back
                                   </button>

                                   <button onClick={addBlock} style={{ marginBottom: 16 }}>
                                   + Add 30-Minute Block
                                   </button>

                                   {blocks.map((block) => {
                                       const sorted = [...block.tasks].sort(
                                           (a, b) => priorityScore(b) - priorityScore(a)
                                       );

                                       return (
                                           <div
                                           key={block.id}
                                           style={{
                                               border: "1px solid #333",
                                               padding: 12,
                                               marginBottom: 16,
                                           }}
                                           >
                                           <div style={{ display: "flex", justifyContent: "space-between" }}>
                                           <strong>{block.label}</strong>
                                           <button
                                           onClick={() => setConfirm(() => () => deleteBlock(block.id))}
                                           style={{ background: "#300", color: "#fff" }}
                                           >
                                           Delete Block
                                           </button>
                                           </div>

                                           {sorted.map((task) => (
                                               <div key={task.id} style={{ border: "1px solid #222", marginTop: 10, padding: 8 }}>

                                            <textarea name="comments" rows="3" cols="50"
                                               value={task.title}
                                               onChange={(e) =>
                                                   updateTask(block.id, task.id, { title: e.target.value })
                                               }
                                               style={{
                                                   width: "100%",
                                                   background: "#000",
                                                   color: "#fff",
                                                   border: "1px solid #555",
                                                   fontSize: 21,
                                               }}
                                            >
                                                Enter your text here...
                                                </textarea>



                                               <div style={{ display: "flex", gap: 8, fontSize: 15, marginTop: 6 }}>
                                               {(["specific", "measurable", "achievable", "relevant", "timeBound"] as const).map(
                                                   (k) => (
                                                       <label key={k}>
                                                       <input
                                                       type="checkbox"
                                                       checked={task[k]}
                                                       onChange={(e) =>
                                                           updateTask(block.id, task.id, { [k]: e.target.checked })
                                                       }
                                                       />{" "}
                                                       {k[0].toUpperCase()}
                                                       </label>
                                                   )
                                               )}
                                               </div>

                                               <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                               {(["impact", "urgency", "effort"] as const).map((k) => (
                                                   <label key={k}>
                                                   {k}
                                                   <input
                                                   type="number"
                                                   min={1}
                                                   max={5}
                                                   value={task[k]}
                                                   onChange={(e) =>
                                                       updateTask(block.id, task.id, { [k]: Number(e.target.value) })
                                                   }
                                                   style={{
                                                       width: 40,
                                                       marginLeft: 4,
                                                       background: "#000",
                                                       color: "#fff",
                                                       border: "1px solid #555",
                                                       fontSize: 18,
                                                   }}
                                                   />
                                                   </label>
                                               ))}
                                               </div>

                                               <div style={{ fontSize: 12 }}>
                                               Priority: {priorityScore(task).toFixed(2)}
                                               </div>

                                               <button
                                               onClick={() => setConfirm(() => () => deleteTask(block.id, task.id))}
                                               style={{ background: "#400", color: "#fff", marginTop: 6 }}
                                               >
                                               Delete Task
                                               </button>
                                               </div>
                                           ))}

                                           <button
                                           onClick={() =>
                                               setBlocks((prev) =>
                                                         prev.map((b) =>
                                                                  b.id === block.id
                                                                      ? { ...b, tasks: [...b.tasks, defaultTask()] }
                                                                      : b
                                                                 )
                                                        )
                                           }
                                           style={{ marginTop: 8 }}
                                           >
                                           + Add Task
                                           </button>
                                           </div>
                                       );
                                   })}

                                   {/* CONFIRM MODAL */}
                                   {confirm && (
                                       <div
                                       style={{
                                           position: "fixed",
                                           inset: 0,
                                           background: "rgba(0,0,0,0.85)",
                                           display: "flex",
                                           alignItems: "center",
                                           justifyContent: "center",
                                       }}
                                       >
                                       <div style={{ background: "#111", padding: 20 }}>
                                       <p>Are you sure?</p>
                                       <button
                                       onClick={() => {
                                           confirm();
                                           setConfirm(null);
                                       }}
                                       >
                                       Yes
                                       </button>
                                       <button onClick={() => setConfirm(null)} style={{ marginLeft: 10 }}>
                                       No
                                       </button>
                                       </div>
                                       </div>
                                   )}
                                   </div>
                               );
}
