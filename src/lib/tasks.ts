export type PriorityLevel = "low" | "medium" | "high";
export type TaskStatus = "open" | "completed" | "postponed";
export type RoomId =
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "living-room"
  | "laundry"
  | "hallway"
  | "general";

export type Room = {
  id: RoomId;
  name: string;
  color: string;
};

export type HouseholdTask = {
  id: string;
  title: string;
  category: string;
  roomId: RoomId;
  intervalDays: number;
  dueDate: string;
  urgency: PriorityLevel;
  importance: PriorityLevel;
  estimatedMinutes: number;
  status: TaskStatus;
  completedAt?: string;
  postponedUntil?: string;
};

export const rooms: Room[] = [
  { id: "kitchen", name: "Küche", color: "#dc8a4c" },
  { id: "bathroom", name: "Bad", color: "#6aa6b8" },
  { id: "bedroom", name: "Schlafzimmer", color: "#9f8bc3" },
  { id: "living-room", name: "Wohnzimmer", color: "#7aa66a" },
  { id: "laundry", name: "Wäsche", color: "#d6a85c" },
  { id: "hallway", name: "Flur", color: "#c87983" },
  { id: "general", name: "Allgemein", color: "#8c8177" },
];

export const initialTasks: HouseholdTask[] = [
  {
    id: "change-bedding",
    title: "Bettwäsche wechseln",
    category: "Schlafzimmer",
    roomId: "bedroom",
    intervalDays: 14,
    dueDate: "2026-07-18",
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 15,
    status: "open",
  },
  {
    id: "clean-fridge",
    title: "Kühlschrank auswischen",
    category: "Küche",
    roomId: "kitchen",
    intervalDays: 30,
    dueDate: "2026-07-18",
    urgency: "high",
    importance: "high",
    estimatedMinutes: 25,
    status: "open",
  },
  {
    id: "deep-clean-bathroom",
    title: "Bad Deep Clean",
    category: "Bad",
    roomId: "bathroom",
    intervalDays: 7,
    dueDate: "2026-07-18",
    urgency: "high",
    importance: "medium",
    estimatedMinutes: 35,
    status: "open",
  },
  {
    id: "clean-washing-machine",
    title: "Waschmaschine reinigen",
    category: "Bad",
    roomId: "laundry",
    intervalDays: 45,
    dueDate: "2026-07-20",
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 10,
    status: "open",
  },
  {
    id: "check-pantry",
    title: "Vorratsschrank prüfen",
    category: "Küche",
    roomId: "kitchen",
    intervalDays: 21,
    dueDate: "2026-07-21",
    urgency: "low",
    importance: "low",
    estimatedMinutes: 12,
    status: "open",
  },
  {
    id: "wipe-windowsill",
    title: "Fensterbank abwischen",
    category: "Wohnbereich",
    roomId: "living-room",
    intervalDays: 14,
    dueDate: "2026-07-22",
    urgency: "low",
    importance: "low",
    estimatedMinutes: 8,
    status: "open",
  },
];

const priorityWeight: Record<PriorityLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function formatInterval(intervalDays: number) {
  return `alle ${intervalDays} Tage`;
}

export function getTomorrowIso(todayIso: string) {
  return addDaysIso(todayIso, 1);
}

export function addDaysIso(dateIso: string, days: number) {
  const [year, month, day] = dateIso.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + days));

  return nextDate.toISOString().slice(0, 10);
}

export function getNextDueDateAfterCompletion(
  task: HouseholdTask,
  completedAtIso: string,
) {
  return addDaysIso(completedAtIso, task.intervalDays);
}

export function getNextDueDateInRhythm(task: HouseholdTask, todayIso: string) {
  let nextDueDate = task.dueDate;

  while (nextDueDate <= todayIso) {
    nextDueDate = addDaysIso(nextDueDate, task.intervalDays);
  }

  return nextDueDate;
}

export function isDueToday(task: HouseholdTask, todayIso: string) {
  return task.status === "open" && task.dueDate <= todayIso;
}

export function isOverdue(task: HouseholdTask, todayIso: string) {
  return task.status === "open" && task.dueDate < todayIso;
}

export function isCompletedThisWeek(task: HouseholdTask, todayIso: string) {
  if (!task.completedAt) {
    return false;
  }

  const today = new Date(`${todayIso}T00:00:00`);
  const completedAt = new Date(`${task.completedAt}T00:00:00`);
  const dayOffset = (today.getDay() + 6) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOffset);

  return completedAt >= weekStart && completedAt <= today;
}

export function sortTasksForRoadmap(tasks: HouseholdTask[]) {
  return [...tasks].sort((first, second) => {
    const firstScore =
      priorityWeight[first.urgency] * 2 + priorityWeight[first.importance];
    const secondScore =
      priorityWeight[second.urgency] * 2 + priorityWeight[second.importance];

    if (firstScore !== secondScore) {
      return secondScore - firstScore;
    }

    if (first.estimatedMinutes !== second.estimatedMinutes) {
      return first.estimatedMinutes - second.estimatedMinutes;
    }

    return first.title.localeCompare(second.title, "de");
  });
}

export function describeRoadmapReason(task: HouseholdTask) {
  if (task.urgency === "high" && task.importance === "high") {
    return "dringlich und wichtig";
  }

  if (task.urgency === "high") {
    return "dringlich";
  }

  if (task.importance === "high") {
    return "wichtig";
  }

  if (task.estimatedMinutes <= 15) {
    return "schnell machbar";
  }

  return "ruhig einplanen";
}
