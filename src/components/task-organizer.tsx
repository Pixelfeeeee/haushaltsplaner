"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  completeCloudTask,
  createCloudTask,
  deleteCloudTask,
  fetchHouseholdTasks,
  getOrCreateDefaultHousehold,
  updateCloudTask,
} from "@/lib/cloud-tasks";
import {
  describeRoadmapReason,
  formatInterval,
  getNextDueDateAfterCompletion,
  getNextDueDateInRhythm,
  getTomorrowIso,
  initialTasks,
  isCompletedThisWeek,
  isDueToday,
  isOverdue,
  rooms,
  sortTasksForRoadmap,
  taskTemplates,
  type HouseholdTask,
  type Room,
  type RoomId,
  type TaskTemplate,
} from "@/lib/tasks";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "@/app/page.module.css";

type View = "today" | "tomorrow" | "rooms" | "all";
type TemplateFilter = "all" | "room" | "quick" | "deep" | "rare";
type StoredTaskData = {
  tasks: HouseholdTask[];
  version: 1;
};

const taskStorageKey = "haushaltsplaner.tasks";

const viewLabels: Record<View, string> = {
  today: "Heute",
  tomorrow: "Morgen",
  rooms: "Räume",
  all: "Alle",
};

const templateFilterLabels: Record<TemplateFilter, string> = {
  all: "Alle",
  room: "Raum",
  quick: "Schnell",
  deep: "Deep Clean",
  rare: "Selten",
};

export function TaskOrganizer() {
  const [todayIso] = useState(getLocalDateIso);
  const tomorrowIso = getTomorrowIso(todayIso);
  const [tasks, setTasks] = useState<HouseholdTask[]>(loadStoredTasks);
  const localImportTasksRef = useRef(tasks);
  const [session, setSession] = useState<Session | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [isCloudLoading, setIsCloudLoading] = useState(false);
  const [cloudMessage, setCloudMessage] = useState("");
  const [activeView, setActiveView] = useState<View>("today");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const storedValue: StoredTaskData = {
      tasks,
      version: 1,
    };

    window.localStorage.setItem(taskStorageKey, JSON.stringify(storedValue));
  }, [tasks]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession) {
        setHouseholdId(null);
        setCloudMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) {
      return;
    }

    const client = supabase;
    const user = session.user;
    let isCancelled = false;

    async function loadCloudHousehold() {
      setIsCloudLoading(true);
      setCloudMessage("Synchronisiere Haushalt ...");

      try {
        const nextHouseholdId = await getOrCreateDefaultHousehold(
          client,
          user,
        );
        const cloudTasks = await fetchHouseholdTasks(client, nextHouseholdId);

        if (isCancelled) {
          return;
        }

        setHouseholdId(nextHouseholdId);

        if (cloudTasks.length > 0) {
          setTasks(cloudTasks);
          setCloudMessage("Cloud-Sync aktiv");
          return;
        }

        const importedTasks = await Promise.all(
          localImportTasksRef.current.map((task) =>
            createCloudTask(client, nextHouseholdId, user.id, task),
          ),
        );

        if (!isCancelled) {
          setTasks(importedTasks);
          setCloudMessage("Lokale Aufgaben wurden in Zuhause übernommen");
        }
      } catch (error) {
        setCloudMessage(getErrorMessage(error));
      } finally {
        if (!isCancelled) {
          setIsCloudLoading(false);
        }
      }
    }

    loadCloudHousehold();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  const dueTodayTasks = useMemo(
    () => sortTasksForRoadmap(tasks.filter((task) => isDueToday(task, todayIso))),
    [tasks, todayIso],
  );
  const overdueCount = useMemo(
    () => tasks.filter((task) => isOverdue(task, todayIso)).length,
    [tasks, todayIso],
  );
  const completedThisWeekCount = useMemo(
    () => tasks.filter((task) => isCompletedThisWeek(task, todayIso)).length,
    [tasks, todayIso],
  );
  const tomorrowTasks = useMemo(
    () =>
      sortTasksByDueDate(
        tasks.filter(
          (task) => task.status === "open" && task.dueDate === tomorrowIso,
        ),
      ),
    [tasks, tomorrowIso],
  );
  const allOpenTasks = useMemo(
    () =>
      sortTasksForRoadmap(tasks.filter((task) => task.status === "open")).sort(
        (first, second) => first.dueDate.localeCompare(second.dueDate),
      ),
    [tasks],
  );
  const roomSummaries = useMemo(
    () =>
      rooms.map((room) => {
        const roomTasks = tasks.filter((task) => task.roomId === room.id);
        const openTasks = roomTasks.filter((task) => task.status === "open");
        const dueTasks = sortTasksForRoadmap(
          openTasks.filter((task) => isDueToday(task, todayIso)),
        );

        return {
          room,
          openTasks,
          dueTasks,
          nextTasks: sortTasksByDueDate(openTasks).slice(0, 3),
          completedThisWeek: roomTasks.filter((task) =>
            isCompletedThisWeek(task, todayIso),
          ).length,
        };
      }),
    [tasks, todayIso],
  );
  const focusTasks = dueTodayTasks.length > 0 ? dueTodayTasks : tomorrowTasks;
  const activeFocusTask =
    focusTasks.length > 0 ? focusTasks[focusIndex % focusTasks.length] : undefined;
  const editingTask = tasks.find((task) => task.id === editingTaskId);

  async function completeTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    const nextDueDate = getNextDueDateAfterCompletion(task, todayIso);

    if (supabase && householdId && session?.user) {
      try {
        const updatedTask = await completeCloudTask(
          supabase,
          householdId,
          session.user.id,
          task,
          todayIso,
          nextDueDate,
        );

        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            currentTask.id === taskId ? updatedTask : currentTask,
          ),
        );
        setCloudMessage("Erledigung gespeichert");
        return;
      } catch (error) {
        setCloudMessage(getErrorMessage(error));
      }
    }

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === taskId
          ? {
              ...currentTask,
              completedAt: todayIso,
              dueDate: nextDueDate,
              postponedUntil: undefined,
              status: "open",
            }
          : currentTask,
      ),
    );
  }

  async function postponeTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    const updatedTask = {
      ...task,
      dueDate: tomorrowIso,
      postponedUntil: tomorrowIso,
      status: "open" as const,
    };

    await saveUpdatedTask(updatedTask);
  }

  async function skipTask(taskId: string) {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    const updatedTask = {
      ...task,
      dueDate: getNextDueDateInRhythm(task, todayIso),
      postponedUntil: undefined,
      status: "open" as const,
    };

    await saveUpdatedTask(updatedTask);
  }

  async function addTask(task: HouseholdTask) {
    if (supabase && householdId && session?.user) {
      try {
        const cloudTask = await createCloudTask(
          supabase,
          householdId,
          session.user.id,
          task,
        );

        setTasks((currentTasks) => [cloudTask, ...currentTasks]);
        setCloudMessage("Aufgabe in Zuhause gespeichert");
      } catch (error) {
        setCloudMessage(getErrorMessage(error));
        setTasks((currentTasks) => [task, ...currentTasks]);
      }
    } else {
      setTasks((currentTasks) => [task, ...currentTasks]);
    }

    setActiveView("today");
    setIsCreateOpen(false);
  }

  async function updateTask(updatedTask: HouseholdTask) {
    await saveUpdatedTask(updatedTask);
    setEditingTaskId(null);
  }

  async function deleteTask(taskId: string) {
    if (supabase && householdId && session?.user) {
      try {
        await deleteCloudTask(supabase, taskId);
        setCloudMessage("Aufgabe gelöscht");
      } catch (error) {
        setCloudMessage(getErrorMessage(error));
        return;
      }
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
    }
  }

  function openFocusMode() {
    setFocusIndex(0);
    setIsFocusMode(true);
    setIsCreateOpen(false);
    setEditingTaskId(null);
  }

  async function saveUpdatedTask(updatedTask: HouseholdTask) {
    if (supabase && householdId && session?.user) {
      try {
        const cloudTask = await updateCloudTask(supabase, updatedTask);

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? cloudTask : task,
          ),
        );
        setCloudMessage("Aufgabe gespeichert");
        return;
      } catch (error) {
        setCloudMessage(getErrorMessage(error));
      }
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  function closeFocusMode() {
    setIsFocusMode(false);
  }

  function showNextFocusTask() {
    if (focusTasks.length === 0) {
      return;
    }

    setFocusIndex((currentIndex) => (currentIndex + 1) % focusTasks.length);
  }

  function switchView(view: View) {
    setActiveView(view);
    setIsFocusMode(false);
    setIsCreateOpen(false);
    setEditingTaskId(null);
  }

  const pageTitle = activeView === "today" ? "Heute" : viewLabels[activeView];
  const pageSummary = getPageSummary({
    activeView,
    completedThisWeekCount,
    dueTodayCount: dueTodayTasks.length,
    focusCount: focusTasks.length,
    focusIndex,
    isFocusMode,
    taskCount: tasks.length,
    tomorrowCount: tomorrowTasks.length,
  });

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.kicker}>Haushaltsplaner</p>
          <h1>{isFocusMode ? "Fokus" : pageTitle}</h1>
          <p className={styles.summary}>{pageSummary}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.secondaryAction}
            onClick={isFocusMode ? closeFocusMode : openFocusMode}
            type="button"
          >
            {isFocusMode ? "Schließen" : "Fokus"}
          </button>
          <button
            className={styles.primaryAction}
            onClick={() => {
              setIsCreateOpen((currentValue) => !currentValue);
              setIsFocusMode(false);
              setEditingTaskId(null);
            }}
            type="button"
          >
            {isCreateOpen ? "Abbrechen" : "Aufgabe anlegen"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <AuthPanel
        cloudMessage={cloudMessage}
        isCloudLoading={isCloudLoading}
        session={session}
      />

      {isCreateOpen ? (
        <TaskForm existingTasks={tasks} onSaveTask={addTask} todayIso={todayIso} />
      ) : null}

      {editingTask ? (
        <TaskForm
          existingTasks={tasks}
          initialTask={editingTask}
          onSaveTask={updateTask}
          todayIso={todayIso}
        />
      ) : null}

      {isFocusMode ? (
        <FocusView
          focusTask={activeFocusTask}
          onCompleteTask={completeTask}
          onNextTask={showNextFocusTask}
          onPostponeTask={postponeTask}
          onSkipTask={skipTask}
          todayIso={todayIso}
        />
      ) : null}

      {!isFocusMode && activeView === "today" ? (
        <TodayView
          completedThisWeekCount={completedThisWeekCount}
          dueTodayTasks={dueTodayTasks}
          onCompleteTask={completeTask}
          onPostponeTask={postponeTask}
          onSkipTask={skipTask}
          overdueCount={overdueCount}
          todayIso={todayIso}
        />
      ) : null}

      {!isFocusMode && activeView === "tomorrow" ? (
        <TomorrowView
          onCompleteTask={completeTask}
          onPostponeTask={postponeTask}
          onSkipTask={skipTask}
          tasks={tomorrowTasks}
          todayIso={todayIso}
        />
      ) : null}

      {!isFocusMode && activeView === "rooms" ? (
        <RoomsView
          onCompleteTask={completeTask}
          onPostponeTask={postponeTask}
          onSkipTask={skipTask}
          roomSummaries={roomSummaries}
          todayIso={todayIso}
        />
      ) : null}

      {!isFocusMode && activeView === "all" ? (
        <AllTasksView
          tasks={allOpenTasks}
          onDeleteTask={deleteTask}
          onEditTask={setEditingTaskId}
          onCompleteTask={completeTask}
          onPostponeTask={postponeTask}
          onSkipTask={skipTask}
          todayIso={todayIso}
        />
      ) : null}

      <nav aria-label="Hauptnavigation" className={styles.bottomNav}>
        {(["today", "tomorrow", "rooms", "all"] as View[]).map((view) => (
          <button
            aria-current={activeView === view ? "page" : undefined}
            className={activeView === view ? styles.navItemActive : styles.navItem}
            key={view}
            onClick={() => switchView(view)}
            type="button"
          >
            {viewLabels[view]}
          </button>
        ))}
      </nav>
    </div>
  );
}

type FocusViewProps = TaskActions & {
  focusTask?: HouseholdTask;
  onNextTask: () => void;
  todayIso: string;
};

function FocusView({
  focusTask,
  onCompleteTask,
  onNextTask,
  onPostponeTask,
  onSkipTask,
  todayIso,
}: FocusViewProps) {
  if (!focusTask) {
    return (
      <main className={styles.focusShell}>
        <div className={styles.emptyState}>
          <h3>Nichts im Fokus.</h3>
          <p>Heute gibt es gerade keine Aufgabe, die dich anstarrt.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.focusShell}>
      <article className={styles.focusTask}>
        <div className={styles.taskMeta}>
          <RoomTag room={getRoom(focusTask.roomId)} />
          <span>{formatInterval(focusTask.intervalDays)}</span>
          <span>{describeRoadmapReason(focusTask)}</span>
          <span>{focusTask.estimatedMinutes} Min.</span>
        </div>
        <h2>{focusTask.title}</h2>
        <div className={styles.focusActions}>
          <button
            className={styles.primaryAction}
            onClick={() => onCompleteTask(focusTask.id)}
            type="button"
          >
            Erledigt
          </button>
          {focusTask.dueDate <= todayIso ? (
            <button
              className={styles.secondaryAction}
              onClick={() => onPostponeTask(focusTask.id)}
              type="button"
            >
              Morgen
            </button>
          ) : null}
          {focusTask.dueDate <= todayIso ? (
            <button
              className={styles.secondaryAction}
              onClick={() => onSkipTask(focusTask.id)}
              type="button"
            >
              Überspringen
            </button>
          ) : null}
          <button
            className={styles.secondaryAction}
            onClick={onNextTask}
            type="button"
          >
            Weiter
          </button>
        </div>
      </article>
    </main>
  );
}

type AuthPanelProps = {
  cloudMessage: string;
  isCloudLoading: boolean;
  session: Session | null;
};

function AuthPanel({ cloudMessage, isCloudLoading, session }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [panelMessage, setPanelMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <section className={styles.authPanel} aria-label="Cloud-Sync Setup">
        <div>
          <strong>Lokaler Modus</strong>
          <p>Für Login fehlt noch `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</p>
        </div>
      </section>
    );
  }

  if (session?.user) {
    return (
      <section className={styles.authPanel} aria-label="Cloud-Sync Status">
        <div>
          <strong>Zuhause</strong>
          <p>
            {isCloudLoading
              ? "Sync läuft ..."
              : cloudMessage || "Cloud-Sync aktiv"}
          </p>
        </div>
        <button
          className={styles.secondaryAction}
          onClick={() => {
            void supabase?.auth.signOut();
          }}
          type="button"
        >
          Logout
        </button>
      </section>
    );
  }

  async function submitAuth(mode: "sign-in" | "sign-up") {
    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setPanelMessage("");

    const credentials = {
      email,
      password,
    };
    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    if (error) {
      setPanelMessage(error.message);
    } else {
      setPanelMessage(
        mode === "sign-in"
          ? "Login erfolgreich."
          : "Account angelegt. Prüfe ggf. deine E-Mails.",
      );
    }

    setIsSubmitting(false);
  }

  return (
    <section className={styles.authPanel} aria-label="Login">
      <div>
        <strong>Cloud-Sync</strong>
        <p>Einloggen, damit dein Haushalt online gespeichert wird.</p>
      </div>
      <form
        className={styles.authForm}
        onSubmit={(event) => {
          event.preventDefault();
          void submitAuth("sign-in");
        }}
      >
        <input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-Mail"
          type="email"
          value={email}
        />
        <input
          autoComplete="current-password"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Passwort"
          type="password"
          value={password}
        />
        <div className={styles.authActions}>
          <button
            className={styles.primaryAction}
            disabled={isSubmitting}
            type="submit"
          >
            Login
          </button>
          <button
            className={styles.secondaryAction}
            disabled={isSubmitting}
            onClick={() => {
              void submitAuth("sign-up");
            }}
            type="button"
          >
            Registrieren
          </button>
        </div>
        {panelMessage ? <p>{panelMessage}</p> : null}
      </form>
    </section>
  );
}

type TaskFormProps = {
  existingTasks: HouseholdTask[];
  initialTask?: HouseholdTask;
  onSaveTask: (task: HouseholdTask) => Promise<void> | void;
  todayIso: string;
};

function TaskForm({
  existingTasks,
  initialTask,
  onSaveTask,
  todayIso,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [roomId, setRoomId] = useState<RoomId>(initialTask?.roomId ?? "kitchen");
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>("room");
  const [intervalDays, setIntervalDays] = useState(
    initialTask?.intervalDays ?? 7,
  );
  const [urgency, setUrgency] = useState<HouseholdTask["urgency"]>(
    initialTask?.urgency ?? "medium",
  );
  const [importance, setImportance] = useState<HouseholdTask["importance"]>(
    initialTask?.importance ?? "medium",
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initialTask?.estimatedMinutes ?? 15,
  );
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? todayIso);
  const roomTemplates = useMemo(
    () => taskTemplates.filter((template) => template.roomId === roomId),
    [roomId],
  );
  const suggestedTemplates = useMemo(
    () =>
      getSuggestedTemplates({
        existingTasks,
        filter: templateFilter,
        roomId,
        roomTemplates,
        title,
      }),
    [existingTasks, roomId, roomTemplates, templateFilter, title],
  );

  function applyTemplate(template: TaskTemplate) {
    setTitle(template.title);
    setRoomId(template.roomId);
    setIntervalDays(template.intervalDays);
    setUrgency(template.urgency);
    setImportance(template.importance);
    setEstimatedMinutes(template.estimatedMinutes);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const room = getRoom(roomId);

    void onSaveTask({
      id: initialTask?.id ?? `custom-${Date.now()}`,
      title: trimmedTitle,
      category: room.name,
      roomId,
      intervalDays,
      dueDate,
      urgency,
      importance,
      estimatedMinutes,
      status: initialTask?.status ?? "open",
      completedAt: initialTask?.completedAt,
      postponedUntil: initialTask?.postponedUntil,
    });

    setTitle("");
  }

  return (
    <section className={styles.createPanel} aria-labelledby="create-task-title">
      <form onSubmit={handleSubmit}>
        <div className={styles.sectionHeader}>
          <h2 id="create-task-title">
            {initialTask ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
          </h2>
        </div>
        <label className={styles.field}>
          <span>Raum</span>
          <select
            onChange={(event) => setRoomId(event.target.value as RoomId)}
            value={roomId}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Name</span>
          <input
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
            placeholder="z.B. Sofa absaugen"
            value={title}
          />
        </label>
        {!initialTask ? (
          <section className={styles.templatePanel} aria-label="Aufgabenvorlagen">
            <div className={styles.templateHeader}>
              <span>
                {title.trim().length > 0 ? "Vorschläge" : "Schnellauswahl"}
              </span>
              <strong>
                {title.trim().length > 0
                  ? `${suggestedTemplates.length} Treffer`
                  : getRoom(roomId).name}
              </strong>
            </div>
            <div className={styles.templateFilters} aria-label="Vorlagen filtern">
              {(["room", "all", "quick", "deep", "rare"] as TemplateFilter[]).map(
                (filter) => (
                  <button
                    aria-pressed={templateFilter === filter}
                    key={filter}
                    onClick={() => setTemplateFilter(filter)}
                    type="button"
                  >
                    {templateFilterLabels[filter]}
                  </button>
                ),
              )}
            </div>
            {suggestedTemplates.length > 0 ? (
              <div className={styles.templateList}>
                {suggestedTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    type="button"
                  >
                    <span>{template.title}</span>
                    <small>
                      {getRoom(template.roomId).name} ·{" "}
                      {formatInterval(template.intervalDays)} ·{" "}
                      {template.estimatedMinutes} Min.
                    </small>
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.templateEmpty}>
                Keine Vorlage gefunden. Du kannst die Aufgabe trotzdem speichern.
              </p>
            )}
          </section>
        ) : null}
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Alle wie viele Tage?</span>
            <input
              min="1"
              onChange={(event) => setIntervalDays(Number(event.target.value))}
              type="number"
              value={intervalDays}
            />
          </label>
          <label className={styles.field}>
            <span>Startdatum</span>
            <input
              onChange={(event) => setDueDate(event.target.value)}
              type="date"
              value={dueDate}
            />
          </label>
          <label className={styles.field}>
            <span>Minuten</span>
            <input
              min="1"
              onChange={(event) =>
                setEstimatedMinutes(Number(event.target.value))
              }
              type="number"
              value={estimatedMinutes}
            />
          </label>
        </div>
        <div className={styles.formGrid}>
          <PriorityField
            label="Dringlichkeit"
            onChange={setUrgency}
            value={urgency}
          />
          <PriorityField
            label="Wichtigkeit"
            onChange={setImportance}
            value={importance}
          />
        </div>
        <button className={styles.primaryAction} type="submit">
          {initialTask ? "Änderungen speichern" : "Speichern"}
        </button>
      </form>
    </section>
  );
}

type PriorityFieldProps = {
  label: string;
  onChange: (value: HouseholdTask["urgency"]) => void;
  value: HouseholdTask["urgency"];
};

function PriorityField({ label, onChange, value }: PriorityFieldProps) {
  return (
    <fieldset className={styles.segmentField}>
      <legend>{label}</legend>
      {(["low", "medium", "high"] as HouseholdTask["urgency"][]).map(
        (priority) => (
          <label key={priority}>
            <input
              checked={value === priority}
              onChange={() => onChange(priority)}
              type="radio"
            />
            <span>{formatPriority(priority)}</span>
          </label>
        ),
      )}
    </fieldset>
  );
}

type TomorrowViewProps = TaskActions & {
  tasks: HouseholdTask[];
  todayIso: string;
};

function TomorrowView({
  onCompleteTask,
  onPostponeTask,
  onSkipTask,
  tasks,
  todayIso,
}: TomorrowViewProps) {
  return (
    <main className={styles.singleColumn}>
      <section aria-labelledby="tomorrow-title">
        <div className={styles.sectionHeader}>
          <h2 id="tomorrow-title">Morgen geplant</h2>
        </div>
        <TaskList
          emptyText="Noch nichts vertagt. Morgen-Sandra ist vorsichtig optimistisch."
          emptyTitle="Morgen ist noch frei."
          onCompleteTask={onCompleteTask}
          onPostponeTask={onPostponeTask}
          onSkipTask={onSkipTask}
          tasks={tasks}
          todayIso={todayIso}
        />
      </section>
    </main>
  );
}

type TaskActions = {
  onCompleteTask: (taskId: string) => Promise<void> | void;
  onPostponeTask: (taskId: string) => Promise<void> | void;
  onSkipTask: (taskId: string) => Promise<void> | void;
};

type TodayViewProps = TaskActions & {
  completedThisWeekCount: number;
  dueTodayTasks: HouseholdTask[];
  overdueCount: number;
  todayIso: string;
};

function TodayView({
  completedThisWeekCount,
  dueTodayTasks,
  onCompleteTask,
  onPostponeTask,
  onSkipTask,
  overdueCount,
  todayIso,
}: TodayViewProps) {
  return (
    <main className={styles.shell}>
      <section aria-labelledby="today-title">
        <h2 className={styles.visuallyHidden} id="today-title">
          Aufgaben für heute
        </h2>
        <TaskList
          emptyText="Der Haushalt guckt kurz irritiert, aber gönnt es dir."
          emptyTitle="Heute ist frei."
          onCompleteTask={onCompleteTask}
          onPostponeTask={onPostponeTask}
          onSkipTask={onSkipTask}
          tasks={dueTodayTasks}
          todayIso={todayIso}
        />
      </section>

      <aside className={styles.sidebar} aria-label="Planungsuebersicht">
        <section className={styles.metricGroup}>
          <div>
            <span>Heute</span>
            <strong>{dueTodayTasks.length}</strong>
          </div>
          <div>
            <span>Überfällig</span>
            <strong>{overdueCount}</strong>
          </div>
          <div>
            <span>Woche erledigt</span>
            <strong>{completedThisWeekCount}</strong>
          </div>
        </section>
      </aside>
    </main>
  );
}

type RoomSummary = {
  room: Room;
  openTasks: HouseholdTask[];
  dueTasks: HouseholdTask[];
  nextTasks: HouseholdTask[];
  completedThisWeek: number;
};

type RoomsViewProps = TaskActions & {
  roomSummaries: RoomSummary[];
  todayIso: string;
};

function RoomsView({
  onCompleteTask,
  onPostponeTask,
  onSkipTask,
  roomSummaries,
  todayIso,
}: RoomsViewProps) {
  return (
    <main className={styles.singleColumn}>
      <section className={styles.roomGrid} aria-label="Aufgaben nach Räumen">
        {roomSummaries.map((summary) => (
          <article className={styles.roomSection} key={summary.room.id}>
            <header className={styles.roomHeader}>
              <div>
                <RoomTitle room={summary.room} />
              </div>
              <p>
                {summary.dueTasks.length} heute, {summary.openTasks.length} offen,{" "}
                {summary.completedThisWeek} erledigt
              </p>
            </header>

            {summary.nextTasks.length > 0 ? (
              <TaskList
                compact
                emptyText=""
                emptyTitle=""
                onCompleteTask={onCompleteTask}
                onPostponeTask={onPostponeTask}
                onSkipTask={onSkipTask}
                tasks={summary.nextTasks}
                todayIso={todayIso}
              />
            ) : (
              <div className={styles.emptyState}>
                <h3>Nichts offen.</h3>
                <p>{summary.room.name} macht gerade keinen Stress.</p>
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

type AllTasksViewProps = TaskActions & {
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onEditTask: (taskId: string) => void;
  tasks: HouseholdTask[];
  todayIso: string;
};

function AllTasksView({
  onDeleteTask,
  onEditTask,
  onCompleteTask,
  onPostponeTask,
  onSkipTask,
  tasks,
  todayIso,
}: AllTasksViewProps) {
  return (
    <main className={styles.singleColumn}>
      <section aria-labelledby="all-tasks-title">
        <div className={styles.sectionHeader}>
          <h2 id="all-tasks-title">Alle offenen Aufgaben</h2>
        </div>
        <TaskList
          emptyText="Alles erledigt. Sehr verdächtig, aber schön."
          emptyTitle="Keine offenen Aufgaben."
          onCompleteTask={onCompleteTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onPostponeTask={onPostponeTask}
          onSkipTask={onSkipTask}
          showManageActions
          tasks={tasks}
          todayIso={todayIso}
        />
      </section>
    </main>
  );
}

type TaskListProps = TaskActions & {
  compact?: boolean;
  emptyText: string;
  emptyTitle: string;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  onEditTask?: (taskId: string) => void;
  showManageActions?: boolean;
  tasks: HouseholdTask[];
  todayIso: string;
};

function TaskList({
  compact = false,
  emptyText,
  emptyTitle,
  onCompleteTask,
  onDeleteTask,
  onEditTask,
  onPostponeTask,
  onSkipTask,
  showManageActions = false,
  tasks,
  todayIso,
}: TaskListProps) {
  return (
    <div className={compact ? styles.taskListCompact : styles.taskList}>
      {tasks.map((task) => (
        <article className={styles.taskItem} key={task.id}>
          <label
            className={styles.checkControl}
            data-testid={`complete-${task.id}`}
          >
            <input
              aria-label={`${task.title} erledigen`}
              checked={task.status === "completed"}
              onChange={() => onCompleteTask(task.id)}
              type="checkbox"
            />
            <span />
          </label>
          <div className={styles.taskContent}>
            <div className={styles.taskMeta}>
              <RoomTag room={getRoom(task.roomId)} />
              <span>{formatInterval(task.intervalDays)}</span>
              <span>{describeRoadmapReason(task)}</span>
              <span>{task.estimatedMinutes} Min.</span>
              {task.dueDate > todayIso ? <span>{formatDate(task.dueDate)}</span> : null}
            </div>
            <h3>{task.title}</h3>
          </div>
          {task.dueDate <= todayIso ? (
            <div className={styles.rowActions}>
              <button
                aria-label={`${task.title} im Rhythmus überspringen`}
                className={styles.skipAction}
                data-testid={`skip-${task.id}`}
                onClick={() => onSkipTask(task.id)}
                title="Im Rhythmus überspringen"
                type="button"
              >
                ↷
              </button>
              <button
                aria-label={`${task.title} auf morgen schieben`}
                className={styles.postponeAction}
                data-testid={`postpone-${task.id}`}
                onClick={() => onPostponeTask(task.id)}
                title="Auf morgen schieben"
                type="button"
              >
                →
              </button>
            </div>
          ) : null}
          {showManageActions ? (
            <div className={styles.manageActions}>
              <button
                aria-label={`${task.title} bearbeiten`}
                onClick={() => onEditTask?.(task.id)}
                type="button"
              >
                Bearbeiten
              </button>
              <button
                aria-label={`${task.title} löschen`}
                onClick={() => onDeleteTask?.(task.id)}
                type="button"
              >
                Löschen
              </button>
            </div>
          ) : null}
        </article>
      ))}

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>{emptyTitle}</h3>
          <p>{emptyText}</p>
        </div>
      ) : null}
    </div>
  );
}

function RoomTag({ room }: { room: Room }) {
  return (
    <span
      className={styles.roomTag}
      style={{ "--room-color": room.color } as CSSProperties}
    >
      <span aria-hidden="true" />
      {room.name}
    </span>
  );
}

function RoomTitle({ room }: { room: Room }) {
  return (
    <h2
      className={styles.roomTitle}
      style={{ "--room-color": room.color } as CSSProperties}
    >
      <span aria-hidden="true" />
      {room.name}
    </h2>
  );
}

function getRoom(roomId: RoomId) {
  return rooms.find((room) => room.id === roomId) ?? rooms[rooms.length - 1];
}

function sortTasksByDueDate(tasks: HouseholdTask[]) {
  return [...tasks].sort((first, second) => {
    if (first.dueDate !== second.dueDate) {
      return first.dueDate.localeCompare(second.dueDate);
    }

    return first.title.localeCompare(second.title, "de");
  });
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${dateIso}T00:00:00`));
}

function formatPriority(priority: HouseholdTask["urgency"]) {
  if (priority === "high") {
    return "hoch";
  }

  if (priority === "medium") {
    return "mittel";
  }

  return "niedrig";
}

type SuggestedTemplateParams = {
  existingTasks: HouseholdTask[];
  filter: TemplateFilter;
  roomId: RoomId;
  roomTemplates: TaskTemplate[];
  title: string;
};

function getSuggestedTemplates({
  existingTasks,
  filter,
  roomId,
  roomTemplates,
  title,
}: SuggestedTemplateParams) {
  const searchTerm = normalizeSearchTerm(title);
  const existingTaskKeys = new Set(
    existingTasks.map((task) => getTemplateMatchKey(task.title, task.roomId)),
  );
  const baseTemplates = searchTerm ? taskTemplates : roomTemplates;

  return baseTemplates
    .filter((template) => {
      if (existingTaskKeys.has(getTemplateMatchKey(template.title, template.roomId))) {
        return false;
      }

      if (!matchesTemplateFilter(template, filter, roomId)) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const room = getRoom(template.roomId);
      const searchableText = normalizeSearchTerm(`${template.title} ${room.name}`);

      return searchableText.includes(searchTerm);
    })
    .sort((first, second) => {
      const firstScore = getTemplateScore(first, searchTerm, roomId);
      const secondScore = getTemplateScore(second, searchTerm, roomId);

      if (firstScore !== secondScore) {
        return secondScore - firstScore;
      }

      if (first.intervalDays !== second.intervalDays) {
        return first.intervalDays - second.intervalDays;
      }

      return first.title.localeCompare(second.title, "de");
    })
    .slice(0, 10);
}

function matchesTemplateFilter(
  template: TaskTemplate,
  filter: TemplateFilter,
  roomId: RoomId,
) {
  if (filter === "all") {
    return true;
  }

  if (filter === "room") {
    return template.roomId === roomId;
  }

  if (filter === "quick") {
    return template.estimatedMinutes <= 10;
  }

  if (filter === "deep") {
    const normalizedTitle = normalizeSearchTerm(template.title);

    return (
      template.estimatedMinutes >= 30 ||
      normalizedTitle.includes("deep") ||
      normalizedTitle.includes("gruendlich")
    );
  }

  return template.intervalDays >= 60;
}

function getTemplateScore(
  template: TaskTemplate,
  searchTerm: string,
  roomId: RoomId,
) {
  const normalizedTitle = normalizeSearchTerm(template.title);
  let score = template.roomId === roomId ? 20 : 0;

  if (!searchTerm) {
    return score + (template.intervalDays <= 14 ? 8 : 0);
  }

  if (normalizedTitle === searchTerm) {
    score += 80;
  } else if (normalizedTitle.startsWith(searchTerm)) {
    score += 60;
  } else if (normalizedTitle.includes(searchTerm)) {
    score += 40;
  }

  return score;
}

function getTemplateMatchKey(title: string, roomId: RoomId) {
  return `${roomId}:${normalizeSearchTerm(title)}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Da ist beim Speichern etwas schiefgelaufen.";
}

function normalizeSearchTerm(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("de")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type PageSummaryParams = {
  activeView: View;
  completedThisWeekCount: number;
  dueTodayCount: number;
  focusCount: number;
  focusIndex: number;
  isFocusMode: boolean;
  taskCount: number;
  tomorrowCount: number;
};

function getPageSummary({
  activeView,
  completedThisWeekCount,
  dueTodayCount,
  focusCount,
  focusIndex,
  isFocusMode,
  taskCount,
  tomorrowCount,
}: PageSummaryParams) {
  if (isFocusMode) {
    return focusCount > 0 ? `${focusIndex + 1} von ${focusCount}` : "keine Aufgabe im Fokus";
  }

  if (activeView === "today") {
    return `${dueTodayCount} fällig, ${completedThisWeekCount} diese Woche erledigt`;
  }

  if (activeView === "tomorrow") {
    return `${tomorrowCount} für morgen geplant`;
  }

  if (activeView === "rooms") {
    return `${rooms.length} Räume, ${dueTodayCount} heute fällig`;
  }

  return `${taskCount} Aufgaben im lokalen Pool`;
}

function getLocalDateIso() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadStoredTasks() {
  if (typeof window === "undefined") {
    return initialTasks;
  }

  try {
    const storedValue = window.localStorage.getItem(taskStorageKey);

    if (!storedValue) {
      return initialTasks;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<StoredTaskData>;

    return Array.isArray(parsedValue.tasks) ? parsedValue.tasks : initialTasks;
  } catch {
    return initialTasks;
  }
}
