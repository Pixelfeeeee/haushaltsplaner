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
  { id: "template-kitchen-counters", title: "Arbeitsflächen abwischen", roomId: "kitchen", intervalDays: 2, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-kitchen-sink", title: "Spüle reinigen", roomId: "kitchen", intervalDays: 3, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-kitchen-stovetop", title: "Herdplatte reinigen", roomId: "kitchen", intervalDays: 3, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-kitchen-fridge", title: "Kühlschrank auswischen", roomId: "kitchen", intervalDays: 30, urgency: "high", importance: "high", estimatedMinutes: 25 },
  { id: "template-kitchen-fridge-sort", title: "Kühlschrank aussortieren", roomId: "kitchen", intervalDays: 7, urgency: "high", importance: "medium", estimatedMinutes: 10 },
  { id: "template-kitchen-freezer", title: "Gefrierfach abtauen", roomId: "kitchen", intervalDays: 180, urgency: "low", importance: "medium", estimatedMinutes: 60 },
  { id: "template-kitchen-pantry", title: "Vorräte prüfen", roomId: "kitchen", intervalDays: 21, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-kitchen-spices", title: "Gewürze sortieren", roomId: "kitchen", intervalDays: 90, urgency: "low", importance: "low", estimatedMinutes: 15 },
  { id: "template-kitchen-oven", title: "Backofen reinigen", roomId: "kitchen", intervalDays: 45, urgency: "medium", importance: "medium", estimatedMinutes: 35 },
  { id: "template-kitchen-microwave", title: "Mikrowelle reinigen", roomId: "kitchen", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-kitchen-dishwasher-filter", title: "Spülmaschinenfilter reinigen", roomId: "kitchen", intervalDays: 30, urgency: "medium", importance: "high", estimatedMinutes: 10 },
  { id: "template-kitchen-dishwasher-clean", title: "Spülmaschine reinigen", roomId: "kitchen", intervalDays: 45, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-kitchen-kettle", title: "Wasserkocher entkalken", roomId: "kitchen", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-kitchen-coffee-machine", title: "Kaffeemaschine entkalken", roomId: "kitchen", intervalDays: 30, urgency: "medium", importance: "medium", estimatedMinutes: 20 },
  { id: "template-kitchen-hood", title: "Dunstabzugshaube reinigen", roomId: "kitchen", intervalDays: 60, urgency: "medium", importance: "medium", estimatedMinutes: 25 },
  { id: "template-kitchen-hood-filter", title: "Fettfilter reinigen", roomId: "kitchen", intervalDays: 60, urgency: "medium", importance: "high", estimatedMinutes: 20 },
  { id: "template-kitchen-trash-bin", title: "Mülleimer auswischen", roomId: "kitchen", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-kitchen-cabinets-fronts", title: "Küchenfronten abwischen", roomId: "kitchen", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-kitchen-cabinets-inside", title: "Küchenschränke innen auswischen", roomId: "kitchen", intervalDays: 120, urgency: "low", importance: "medium", estimatedMinutes: 45 },
  { id: "template-kitchen-cutlery", title: "Besteckschublade auswischen", roomId: "kitchen", intervalDays: 90, urgency: "low", importance: "low", estimatedMinutes: 15 },
  { id: "template-kitchen-small-appliances", title: "Kleingeräte abwischen", roomId: "kitchen", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 15 },
  { id: "template-kitchen-floor", title: "Küchenboden wischen", roomId: "kitchen", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-kitchen-tiles", title: "Fliesenspiegel reinigen", roomId: "kitchen", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-kitchen-grocery-list", title: "Einkaufsliste prüfen", roomId: "kitchen", intervalDays: 3, urgency: "high", importance: "medium", estimatedMinutes: 8 },

  { id: "template-bathroom-deep-clean", title: "Bad Deep Clean", roomId: "bathroom", intervalDays: 7, urgency: "high", importance: "medium", estimatedMinutes: 35 },
  { id: "template-bathroom-toilet", title: "Toilette reinigen", roomId: "bathroom", intervalDays: 3, urgency: "high", importance: "high", estimatedMinutes: 10 },
  { id: "template-bathroom-sink", title: "Waschbecken reinigen", roomId: "bathroom", intervalDays: 3, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-bathroom-shower", title: "Dusche reinigen", roomId: "bathroom", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-bathroom-tub", title: "Badewanne reinigen", roomId: "bathroom", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 12 },
  { id: "template-bathroom-mirror", title: "Spiegel putzen", roomId: "bathroom", intervalDays: 7, urgency: "low", importance: "medium", estimatedMinutes: 5 },
  { id: "template-bathroom-drains", title: "Abflüsse reinigen", roomId: "bathroom", intervalDays: 30, urgency: "medium", importance: "high", estimatedMinutes: 15 },
  { id: "template-bathroom-limescale", title: "Armaturen entkalken", roomId: "bathroom", intervalDays: 21, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-bathroom-grout", title: "Fugen reinigen", roomId: "bathroom", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-bathroom-towels", title: "Handtücher wechseln", roomId: "bathroom", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-bathroom-bathmat", title: "Badematte waschen", roomId: "bathroom", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-bathroom-cosmetics", title: "Kosmetik aussortieren", roomId: "bathroom", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-bathroom-cabinet", title: "Badschrank auswischen", roomId: "bathroom", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-bathroom-brush", title: "Toilettenbürste wechseln", roomId: "bathroom", intervalDays: 90, urgency: "medium", importance: "medium", estimatedMinutes: 5 },
  { id: "template-bathroom-bin", title: "Bad-Mülleimer leeren", roomId: "bathroom", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 5 },
  { id: "template-bathroom-floor", title: "Badboden wischen", roomId: "bathroom", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-bathroom-vent", title: "Badlüfter entstauben", roomId: "bathroom", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 10 },

  { id: "template-bedroom-bedding", title: "Bettwäsche wechseln", roomId: "bedroom", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-bedroom-mattress", title: "Matratze wenden", roomId: "bedroom", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 12 },
  { id: "template-bedroom-mattress-vacuum", title: "Matratze absaugen", roomId: "bedroom", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 15 },
  { id: "template-bedroom-nightstand", title: "Nachttisch ausmisten", roomId: "bedroom", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 10 },
  { id: "template-bedroom-wardrobe", title: "Kleiderschrank sortieren", roomId: "bedroom", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 45 },
  { id: "template-bedroom-season-clothes", title: "Saisonkleidung wechseln", roomId: "bedroom", intervalDays: 180, urgency: "medium", importance: "medium", estimatedMinutes: 60 },
  { id: "template-bedroom-under-bed", title: "Unter dem Bett saugen", roomId: "bedroom", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 12 },
  { id: "template-bedroom-dust", title: "Schlafzimmer abstauben", roomId: "bedroom", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 15 },
  { id: "template-bedroom-curtains", title: "Vorhänge waschen", roomId: "bedroom", intervalDays: 180, urgency: "low", importance: "medium", estimatedMinutes: 45 },
  { id: "template-bedroom-pillows", title: "Kissen waschen", roomId: "bedroom", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-bedroom-duvet", title: "Bettdecke waschen", roomId: "bedroom", intervalDays: 180, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-bedroom-air-out", title: "Bettzeug auslüften", roomId: "bedroom", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 8 },

  { id: "template-living-sofa", title: "Sofa absaugen", roomId: "living-room", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-living-sofa-covers", title: "Sofabezüge waschen", roomId: "living-room", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-living-dust-shelves", title: "Regale abstauben", roomId: "living-room", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 15 },
  { id: "template-living-tv", title: "Fernseher abstauben", roomId: "living-room", intervalDays: 14, urgency: "low", importance: "low", estimatedMinutes: 5 },
  { id: "template-living-remotes", title: "Fernbedienungen reinigen", roomId: "living-room", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 5 },
  { id: "template-living-coffee-table", title: "Couchtisch abwischen", roomId: "living-room", intervalDays: 7, urgency: "low", importance: "medium", estimatedMinutes: 5 },
  { id: "template-living-plants", title: "Wohnzimmerpflanzen pflegen", roomId: "living-room", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-living-books", title: "Bücher und Zeitschriften sortieren", roomId: "living-room", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 15 },
  { id: "template-living-carpet", title: "Teppich gründlich saugen", roomId: "living-room", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-living-windowsill", title: "Fensterbank abwischen", roomId: "living-room", intervalDays: 14, urgency: "low", importance: "low", estimatedMinutes: 8 },
  { id: "template-living-lamps", title: "Lampen entstauben", roomId: "living-room", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 10 },
  { id: "template-living-cables", title: "Kabelchaos sortieren", roomId: "living-room", intervalDays: 90, urgency: "low", importance: "low", estimatedMinutes: 25 },

  { id: "template-laundry-washing-machine", title: "Waschmaschine reinigen", roomId: "laundry", intervalDays: 45, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-laundry-lint-filter", title: "Flusensieb prüfen", roomId: "laundry", intervalDays: 14, urgency: "medium", importance: "high", estimatedMinutes: 10 },
  { id: "template-laundry-detergent-drawer", title: "Waschmittelfach reinigen", roomId: "laundry", intervalDays: 30, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-laundry-sort", title: "Wäsche vorsortieren", roomId: "laundry", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-laundry-bed-linen", title: "Bettwäsche waschen", roomId: "laundry", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 12 },
  { id: "template-laundry-towels", title: "Handtücher waschen", roomId: "laundry", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-laundry-delicates", title: "Feinwäsche einplanen", roomId: "laundry", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-laundry-drying-rack", title: "Wäscheständer abwischen", roomId: "laundry", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 8 },
  { id: "template-laundry-iron", title: "Bügelwäsche erledigen", roomId: "laundry", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-laundry-socks", title: "Socken sortieren", roomId: "laundry", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 15 },
  { id: "template-laundry-cleaning-cloths", title: "Putzlappen waschen", roomId: "laundry", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 8 },
  { id: "template-laundry-dryer-filter", title: "Trocknerfilter reinigen", roomId: "laundry", intervalDays: 7, urgency: "medium", importance: "high", estimatedMinutes: 5 },

  { id: "template-hallway-shoes", title: "Schuhe sortieren", roomId: "hallway", intervalDays: 14, urgency: "low", importance: "low", estimatedMinutes: 10 },
  { id: "template-hallway-entry-mat", title: "Fußmatte ausschütteln", roomId: "hallway", intervalDays: 7, urgency: "low", importance: "medium", estimatedMinutes: 5 },
  { id: "template-hallway-coats", title: "Jacken sortieren", roomId: "hallway", intervalDays: 30, urgency: "low", importance: "low", estimatedMinutes: 15 },
  { id: "template-hallway-keys", title: "Schlüsselablage aufräumen", roomId: "hallway", intervalDays: 14, urgency: "low", importance: "low", estimatedMinutes: 5 },
  { id: "template-hallway-mirror", title: "Flurspiegel putzen", roomId: "hallway", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 5 },
  { id: "template-hallway-floor", title: "Flur saugen und wischen", roomId: "hallway", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-hallway-mail", title: "Post sortieren", roomId: "hallway", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-hallway-bags", title: "Taschen ausräumen", roomId: "hallway", intervalDays: 7, urgency: "low", importance: "low", estimatedMinutes: 8 },
  { id: "template-hallway-door", title: "Haustürbereich reinigen", roomId: "hallway", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 12 },
  { id: "template-hallway-umbrella", title: "Regenschirme prüfen", roomId: "hallway", intervalDays: 90, urgency: "low", importance: "low", estimatedMinutes: 5 },

  { id: "template-general-trash", title: "Müll rausbringen", roomId: "general", intervalDays: 3, urgency: "high", importance: "high", estimatedMinutes: 5 },
  { id: "template-general-recycling", title: "Papier und Glas wegbringen", roomId: "general", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-general-plants", title: "Pflanzen gießen", roomId: "general", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-general-surfaces", title: "Oberflächen abwischen", roomId: "general", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 15 },
  { id: "template-general-vacuum", title: "Wohnung saugen", roomId: "general", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 25 },
  { id: "template-general-mop", title: "Wohnung wischen", roomId: "general", intervalDays: 14, urgency: "medium", importance: "medium", estimatedMinutes: 30 },
  { id: "template-general-dust", title: "Staub wischen", roomId: "general", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 25 },
  { id: "template-general-windows", title: "Fenster putzen", roomId: "general", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 60 },
  { id: "template-general-window-frames", title: "Fensterrahmen reinigen", roomId: "general", intervalDays: 120, urgency: "low", importance: "medium", estimatedMinutes: 45 },
  { id: "template-general-doors", title: "Türen und Griffe abwischen", roomId: "general", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 20 },
  { id: "template-general-light-switches", title: "Lichtschalter reinigen", roomId: "general", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-general-baseboards", title: "Sockelleisten abwischen", roomId: "general", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-general-radiators", title: "Heizkörper entstauben", roomId: "general", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 25 },
  { id: "template-general-smoke-detectors", title: "Rauchmelder testen", roomId: "general", intervalDays: 90, urgency: "medium", importance: "high", estimatedMinutes: 10 },
  { id: "template-general-batteries", title: "Batterien prüfen", roomId: "general", intervalDays: 90, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-general-medicine", title: "Medikamente aussortieren", roomId: "general", intervalDays: 180, urgency: "low", importance: "high", estimatedMinutes: 20 },
  { id: "template-general-documents", title: "Unterlagen sortieren", roomId: "general", intervalDays: 30, urgency: "medium", importance: "medium", estimatedMinutes: 30 },
  { id: "template-general-cleaning-supplies", title: "Putzmittel prüfen", roomId: "general", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 10 },
  { id: "template-general-vacuum-filter", title: "Staubsaugerfilter reinigen", roomId: "general", intervalDays: 30, urgency: "medium", importance: "medium", estimatedMinutes: 10 },
  { id: "template-general-vacuum-bag", title: "Staubsaugerbeutel wechseln", roomId: "general", intervalDays: 30, urgency: "medium", importance: "medium", estimatedMinutes: 5 },
  { id: "template-general-pet-hair", title: "Tierhaare entfernen", roomId: "general", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 20 },
  { id: "template-general-balcony", title: "Balkon fegen", roomId: "general", intervalDays: 14, urgency: "low", importance: "medium", estimatedMinutes: 15 },
  { id: "template-general-balcony-drain", title: "Balkonabfluss prüfen", roomId: "general", intervalDays: 60, urgency: "medium", importance: "high", estimatedMinutes: 10 },
  { id: "template-general-season-deco", title: "Deko wechseln", roomId: "general", intervalDays: 90, urgency: "low", importance: "low", estimatedMinutes: 30 },
  { id: "template-general-donation-box", title: "Spendenkiste packen", roomId: "general", intervalDays: 60, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-general-digital-declutter", title: "Digitale Ablage sortieren", roomId: "general", intervalDays: 30, urgency: "low", importance: "medium", estimatedMinutes: 30 },
  { id: "template-general-meal-plan", title: "Essensplan machen", roomId: "general", intervalDays: 7, urgency: "medium", importance: "medium", estimatedMinutes: 20 },
  { id: "template-general-bags", title: "Mehrwegbeutel zurücklegen", roomId: "general", intervalDays: 7, urgency: "low", importance: "low", estimatedMinutes: 5 },
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
