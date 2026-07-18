"use client";

import { useMemo, useState } from "react";
import {
  describeRoadmapReason,
  formatInterval,
  getTomorrowIso,
  initialTasks,
  isCompletedThisWeek,
  isDueToday,
  isOverdue,
  sortTasksForRoadmap,
  type HouseholdTask,
} from "@/lib/tasks";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "@/app/page.module.css";

const todayIso = "2026-07-18";

export function TaskOrganizer() {
  const [tasks, setTasks] = useState<HouseholdTask[]>(initialTasks);

  const dueTodayTasks = useMemo(
    () => sortTasksForRoadmap(tasks.filter((task) => isDueToday(task, todayIso))),
    [tasks],
  );
  const overdueCount = useMemo(
    () => tasks.filter((task) => isOverdue(task, todayIso)).length,
    [tasks],
  );
  const completedThisWeekCount = useMemo(
    () => tasks.filter((task) => isCompletedThisWeek(task, todayIso)).length,
    [tasks],
  );
  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "open" && task.dueDate > todayIso)
        .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
        .slice(0, 3),
    [tasks],
  );

  function completeTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completedAt: todayIso, status: "completed" }
          : task,
      ),
    );
  }

  function postponeTask(taskId: string) {
    const tomorrowIso = getTomorrowIso(todayIso);

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

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.kicker}>Haushaltsplaner</p>
          <h1>Heute</h1>
          <p className={styles.summary}>
            {dueTodayTasks.length} fällig, {completedThisWeekCount} diese Woche
            erledigt
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryAction}>Fokus</button>
          <button className={styles.primaryAction}>Aufgabe anlegen</button>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.shell}>
        <section aria-labelledby="today-title">
          <h2 className={styles.visuallyHidden} id="today-title">
            Aufgaben für heute
          </h2>
          <div className={styles.taskList}>
            {dueTodayTasks.map((task) => (
              <article className={styles.taskItem} key={task.id}>
                <label
                  className={styles.checkControl}
                  data-testid={`complete-${task.id}`}
                >
                  <input
                    aria-label={`${task.title} erledigen`}
                    checked={task.status === "completed"}
                    onChange={() => completeTask(task.id)}
                    type="checkbox"
                  />
                  <span />
                </label>
                <div className={styles.taskContent}>
                  <div className={styles.taskMeta}>
                    <span>{task.category}</span>
                    <span>{formatInterval(task.intervalDays)}</span>
                    <span>{describeRoadmapReason(task)}</span>
                    <span>{task.estimatedMinutes} Min.</span>
                  </div>
                  <h3>{task.title}</h3>
                </div>
                <button
                  aria-label={`${task.title} auf morgen schieben`}
                  className={styles.postponeAction}
                  data-testid={`postpone-${task.id}`}
                  onClick={() => postponeTask(task.id)}
                  type="button"
                >
                  Morgen
                </button>
              </article>
            ))}

            {dueTodayTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Heute ist frei.</h3>
                <p>Der Haushalt guckt kurz irritiert, aber gönnt es dir.</p>
              </div>
            ) : null}
          </div>
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

          <section>
            <h2 className={styles.sidebarTitle}>Demnächst</h2>
            <ul className={styles.upcomingList}>
              {upcomingTasks.map((task) => (
                <li key={task.id}>
                  <span>{task.title}</span>
                  <small>{formatDate(task.dueDate)}</small>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${dateIso}T00:00:00`));
}
