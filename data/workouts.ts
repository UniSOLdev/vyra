import type { Exercise, Experience } from "@/lib/types"

function ex(
  name: string,
  sets: number,
  reps: string,
  rest: string,
  notes?: string
): Exercise {
  return {
    id: `${name}-${sets}-${reps}`.replace(/\s+/g, "-").toLowerCase(),
    name,
    sets,
    reps,
    rest,
    notes,
    completed: false,
  }
}

const beginnerA: Exercise[] = [
  ex("Goblet squat", 3, "8–12", "90s", "Brace your core. Move with control."),
  ex("Push-up (or incline)", 3, "6–15", "75s", "Stop 1–2 reps before form breaks."),
  ex("Dumbbell row", 3, "8–12 each", "75s", "Pull elbow to hip pocket."),
  ex("Glute bridge", 3, "12–20", "60s", "Squeeze at the top, no arching."),
  ex("Dead bug", 2, "8 each side", "45s", "Low back stays pressed to the floor."),
]

const beginnerB: Exercise[] = [
  ex("Reverse lunge", 3, "8 each", "90s", "Stay tall through the ribcage."),
  ex("Dumbbell floor press", 3, "8–12", "75s", "Elbows ~45° from torso."),
  ex("Single-arm carry", 3, "30–40 yd each", "60s", "Walk tall; ribs down."),
  ex("Plank", 3, "20–40s", "60s", "Breathing steady; hips level."),
  ex("Hamstring slider curl (or RDL)", 3, "8–12", "75s", "Feel tension, not stretch pain."),
]

const beginnerC: Exercise[] = [
  ex("Tempo squat", 3, "6–10", "90s", "3s down, controlled up."),
  ex("1-arm DB press", 3, "8–10 each", "75s", "Full lockout without shrugging."),
  ex("Face pull or band pull-apart", 3, "12–20", "60s", "Upper back finishes the move."),
  ex("Side plank", 2, "20–35s each", "45s", "Hips forward; neck neutral."),
  ex("Farmer carry", 2, "40–60 yd", "90s", "Crush the handles; short steps."),
]

const upper: Exercise[] = [
  ex("Bench or DB press", 4, "6–10", "120s", "Stop before bar speed dies."),
  ex("Pull-up or lat pulldown", 4, "6–12", "120s", "Full range; controlled negative."),
  ex("Seated row", 3, "8–12", "90s", "Pause 1s at the torso."),
  ex("Lateral raise", 3, "12–15", "60s", "Lead with elbows, not wrists."),
  ex("Triceps pushdown", 3, "10–15", "60s", "Elbows pinned to ribs."),
]

const lower: Exercise[] = [
  ex("Back squat or hack squat", 4, "5–8", "150s", "Depth you own with quality."),
  ex("Romanian deadlift", 3, "6–10", "120s", "Hinge; hamstrings load first."),
  ex("Walking lunge", 3, "8 each", "90s", "Short steps; vertical shin."),
  ex("Leg curl", 3, "10–15", "75s", "Control the lowering phase."),
  ex("Calf raise", 3, "12–20", "45s", "Pause at the top."),
]

const pushDay: Exercise[] = [
  ex("Incline press", 4, "6–10", "120s", "Scaps set; smooth bar path."),
  ex("Overhead press", 3, "6–10", "120s", "Ribs down; glutes on."),
  ex("Chest-supported row", 3, "8–12", "90s", "No momentum from hips."),
  ex("Triceps dips or press", 3, "8–12", "75s", "Stop before shoulders crank."),
  ex("Lateral raise", 2, "12–15", "60s", "Smooth reps; no shrugging."),
]

const pullDay: Exercise[] = [
  ex("Deadlift variation", 4, "3–6", "180s", "Hinge pattern; crisp reps."),
  ex("Chest-supported row", 4, "8–12", "90s", "Pause 1s at contraction."),
  ex("Lat pulldown", 3, "8–12", "90s", "Elbows track slightly forward."),
  ex("Hammer curl", 3, "8–12", "60s", "Supinate at the top if comfortable."),
  ex("Rear-delt fly", 3, "12–15", "60s", "Think “spread the chest.”"),
]

const legs: Exercise[] = [
  ex("Squat pattern", 4, "5–8", "150s", "Own your depth every rep."),
  ex("Leg press", 3, "10–15", "120s", "Full foot contact; no butt lift."),
  ex("Leg extension", 3, "12–15", "75s", "2s squeeze at top."),
  ex("Leg curl", 3, "10–15", "75s", "Control the negative."),
  ex("Standing calf", 3, "12–20", "60s", "Straight-leg bias."),
]

const conditioning: Exercise[] = [
  ex("Bike or row intervals", 6, "40s on / 80s easy", "—", "Hard, repeatable effort."),
  ex("Farmer carry", 4, "40 yd", "90s", "Posture tall; brisk pace."),
  ex("Med ball slam", 3, "8–12", "60s", "Hips drive; floor absorbs impact."),
  ex("Bear crawl", 3, "20–30 yd", "75s", "Knees low; shoulders stacked."),
  ex("Finisher: easy spin or walk", 1, "8–12 min", "—", "Bring heart rate down smoothly."),
]

export const SPLIT_TEMPLATES: Record<
  Experience,
  { name: string; exercises: Exercise[] }[]
> = {
  beginner: [
    { name: "Full Body A", exercises: beginnerA },
    { name: "Full Body B", exercises: beginnerB },
    { name: "Full Body C", exercises: beginnerC },
  ],
  intermediate: [
    { name: "Upper", exercises: upper },
    { name: "Lower", exercises: lower },
    { name: "Push", exercises: pushDay },
    { name: "Pull", exercises: pullDay },
  ],
  advanced: [
    { name: "Push", exercises: pushDay },
    { name: "Pull", exercises: pullDay },
    { name: "Legs", exercises: legs },
    { name: "Upper", exercises: upper },
    { name: "Conditioning", exercises: conditioning },
  ],
}
