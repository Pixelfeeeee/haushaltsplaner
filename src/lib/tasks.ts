export type PriorityLevel = "low" | "medium" | "high";
export type TaskStatus = "open" | "completed" | "postponed";

export type HouseholdTask = {
  id: string;
  title: string;
  category: string;
  intervalDays: number;
  dueDate: string;
  urgency: PriorityLevel;
  importance: PriorityLevel;
  estimatedMinutes: number;
  status: TaskStatus;
  completedAt?: string;
  postponedUntil?: string;
};

export const initialTasks: HouseholdTask[] = [
  {
    id: "change-bedding",
    title: "Bettwäsche wechseln",
    category: "Schlafzimmer",
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
  const [year, month, day] = todayIso.split("-").map(Number);
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));

  return tomorrow.toISOString().slice(0, 10);
}

export function isDueToday(task: HouseholdTask, todayIso: string) {
  return task.status === "open" && task.dueDate <= todayIso;
}

export function isOverdue(task: HouseholdTask, todayIso: string) {
  return task.status === "open" && task.dueDate < todayIso;
}

export function isCompletedThisWeek(task: HouseholdTask, todayIso: string) {
  if (task.status !== "completed" || !task.completedAt) {
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
