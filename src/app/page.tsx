import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./page.module.css";

const todayTasks = [
  {
    title: "Bettwäsche wechseln",
    category: "Schlafzimmer",
    rhythm: "alle 14 Tage",
  },
  {
    title: "Kühlschrank auswischen",
    category: "Küche",
    rhythm: "alle 30 Tage",
  },
  {
    title: "Bad Deep Clean",
    category: "Bad",
    rhythm: "alle 7 Tage",
  },
];

const upcomingTasks = [
  "Waschmaschine reinigen",
  "Vorratsschrank prüfen",
  "Fensterbank abwischen",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.kicker}>Haushaltsplaner</p>
          <h1>Heute</h1>
          <p className={styles.summary}>3 fällig, 0 erledigt</p>
        </div>
        <div className={styles.actions}>
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
            {todayTasks.map((task) => (
              <article className={styles.taskItem} key={task.title}>
                <label className={styles.checkControl}>
                  <input type="checkbox" aria-label={`${task.title} erledigen`} />
                  <span />
                </label>
                <div>
                  <div className={styles.taskMeta}>
                    <span>{task.category}</span>
                    <span>{task.rhythm}</span>
                  </div>
                  <h3>{task.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.sidebar} aria-label="Planungsuebersicht">
          <section className={styles.metricGroup}>
            <div>
              <span>Heute</span>
              <strong>3</strong>
            </div>
            <div>
              <span>Überfällig</span>
              <strong>0</strong>
            </div>
            <div>
              <span>Erledigt</span>
              <strong>0</strong>
            </div>
          </section>

          <section>
            <h2 className={styles.sidebarTitle}>Demnächst</h2>
            <ul className={styles.upcomingList}>
              {upcomingTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
