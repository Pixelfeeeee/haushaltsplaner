"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "@/app/page.module.css";

type View = "today" | "tomorrow" | "rooms" | "all";
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

export function TaskOrganizer() {
  const [todayIso] = useState(getLocalDateIso);
  const tomorrowIso = getTomorrowIso(todayIso);
  const [tasks, setTasks] = useState<HouseholdTask[]>(loadStoredTasks);
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

  function completeTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completedAt: todayIso,
              dueDate: getNextDueDateAfterCompletion(task, todayIso),
              postponedUntil: undefined,
              status: "open",
            }
          : task,
      ),
    );
  }

  function postponeTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              dueDate: tomorrowIso,
              postponedUntil: tomorrowIso,
              status: "open",
            }
          : task,
      ),
    );
  }

  function skipTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              dueDate: getNextDueDateInRhythm(task, todayIso),
              postponedUntil: undefined,
              status: "open",
            }
          : task,
      ),
    );
  }

  function addTask(task: HouseholdTask) {
    setTasks((currentTasks) => [task, ...currentTasks]);
    setActiveView("today");
    setIsCreateOpen(false);
  }

  function updateTask(updatedTask: HouseholdTask) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setEditingTaskId(null);
  }

  function deleteTask(taskId: string) {
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

      {isCreateOpen ? (
        <TaskForm onSaveTask={addTask} todayIso={todayIso} />
      ) : null}

      {editingTask ? (
        <TaskForm
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

type TaskFormProps = {
  initialTask?: HouseholdTask;
  onSaveTask: (task: HouseholdTask) => void;
  todayIso: string;
};

function TaskForm({ initialTask, onSaveTask, todayIso }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [roomId, setRoomId] = useState<RoomId>(initialTask?.roomId ?? "kitchen");
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
  const selectedRoomTemplates = taskTemplates.filter(
    (template) => template.roomId === roomId,
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

    onSaveTask({
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
        {!initialTask ? (
          <section className={styles.templatePanel} aria-label="Aufgabenvorlagen">
            <div className={styles.templateHeader}>
              <span>Vorlagen</span>
              <strong>{getRoom(roomId).name}</strong>
            </div>
            <div className={styles.templateList}>
              {selectedRoomTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  type="button"
                >
                  <span>{template.title}</span>
                  <small>
                    {formatInterval(template.intervalDays)} ·{" "}
                    {template.estimatedMinutes} Min.
                  </small>
                </button>
              ))}
            </div>
          </section>
        ) : null}
        <label className={styles.field}>
          <span>Name</span>
          <input
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
            placeholder="z.B. Sofa absaugen"
            value={title}
          />
        </label>
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
  onCompleteTask: (taskId: string) => void;
  onPostponeTask: (taskId: string) => void;
  onSkipTask: (taskId: string) => void;
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
  onDeleteTask: (taskId: string) => void;
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
  onDeleteTask?: (taskId: string) => void;
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
