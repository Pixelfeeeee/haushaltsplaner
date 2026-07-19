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

export type TaskTemplate = {
  id: string;
  title: string;
  roomId: RoomId;
  intervalDays: number;
  urgency: PriorityLevel;
  importance: PriorityLevel;
  estimatedMinutes: number;
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

export const taskTemplates: TaskTemplate[] = [
  {
    id: "template-clean-fridge",
    title: "Kühlschrank auswischen",
    roomId: "kitchen",
    intervalDays: 30,
    urgency: "high",
    importance: "high",
    estimatedMinutes: 25,
  },
  {
    id: "template-check-pantry",
    title: "Vorräte prüfen",
    roomId: "kitchen",
    intervalDays: 21,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 12,
  },
  {
    id: "template-descalers",
    title: "Wasserkocher entkalken",
    roomId: "kitchen",
    intervalDays: 30,
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 10,
  },
  {
    id: "template-oven",
    title: "Backofen reinigen",
    roomId: "kitchen",
    intervalDays: 45,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 35,
  },
  {
    id: "template-bathroom-deep-clean",
    title: "Bad Deep Clean",
    roomId: "bathroom",
    intervalDays: 7,
    urgency: "high",
    importance: "medium",
    estimatedMinutes: 35,
  },
  {
    id: "template-drain",
    title: "Abflüsse reinigen",
    roomId: "bathroom",
    intervalDays: 30,
    urgency: "medium",
    importance: "high",
    estimatedMinutes: 15,
  },
  {
    id: "template-towels",
    title: "Handtücher wechseln",
    roomId: "bathroom",
    intervalDays: 7,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 8,
  },
  {
    id: "template-bedding",
    title: "Bettwäsche wechseln",
    roomId: "bedroom",
    intervalDays: 14,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 15,
  },
  {
    id: "template-mattress",
    title: "Matratze wenden",
    roomId: "bedroom",
    intervalDays: 90,
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 12,
  },
  {
    id: "template-nightstand",
    title: "Nachttisch ausmisten",
    roomId: "bedroom",
    intervalDays: 30,
    urgency: "low",
    importance: "low",
    estimatedMinutes: 10,
  },
  {
    id: "template-sofa",
    title: "Sofa absaugen",
    roomId: "living-room",
    intervalDays: 14,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 12,
  },
  {
    id: "template-dust-shelves",
    title: "Regale abstauben",
    roomId: "living-room",
    intervalDays: 14,
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 15,
  },
  {
    id: "template-remotes",
    title: "Fernbedienungen reinigen",
    roomId: "living-room",
    intervalDays: 30,
    urgency: "low",
    importance: "low",
    estimatedMinutes: 5,
  },
  {
    id: "template-washing-machine",
    title: "Waschmaschine reinigen",
    roomId: "laundry",
    intervalDays: 45,
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 10,
  },
  {
    id: "template-lint-filter",
    title: "Flusensieb prüfen",
    roomId: "laundry",
    intervalDays: 14,
    urgency: "medium",
    importance: "high",
    estimatedMinutes: 10,
  },
  {
    id: "template-laundry-sort",
    title: "Wäsche vorsortieren",
    roomId: "laundry",
    intervalDays: 7,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 12,
  },
  {
    id: "template-shoes",
    title: "Schuhe sortieren",
    roomId: "hallway",
    intervalDays: 14,
    urgency: "low",
    importance: "low",
    estimatedMinutes: 10,
  },
  {
    id: "template-entry-mat",
    title: "Fußmatte ausschütteln",
    roomId: "hallway",
    intervalDays: 7,
    urgency: "low",
    importance: "medium",
    estimatedMinutes: 5,
  },
  {
    id: "template-trash",
    title: "Müll rausbringen",
    roomId: "general",
    intervalDays: 3,
    urgency: "high",
    importance: "high",
    estimatedMinutes: 5,
  },
  {
    id: "template-plants",
    title: "Pflanzen gießen",
    roomId: "general",
    intervalDays: 7,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 10,
  },
  {
    id: "template-surfaces",
    title: "Oberflächen abwischen",
    roomId: "general",
    intervalDays: 7,
    urgency: "medium",
    importance: "medium",
    estimatedMinutes: 15,
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
