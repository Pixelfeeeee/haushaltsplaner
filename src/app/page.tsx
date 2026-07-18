import styles from "./page.module.css";

const todayTasks = [
  {
    title: "Bettwaesche wechseln",
    category: "Schlafzimmer",
    rhythm: "alle 14 Tage",
    tone: "Die Kissen wirken bereits dramatisch.",
  },
  {
    title: "Kuehlschrank auswischen",
    category: "Kueche",
    rhythm: "alle 30 Tage",
    tone: "Da drin wohnt kein Geheimnis, nur Arbeit.",
  },
  {
    title: "Bad Deep Clean",
    category: "Bad",
    rhythm: "alle 7 Tage",
    tone: "Das Waschbecken fuehrt Protokoll.",
  },
];

const upcomingTasks = [
  "Waschmaschine reinigen",
  "Vorratsschrank pruefen",
  "Fensterbank abwischen",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Haushaltsplaner</p>
          <h1>Heute will der Haushalt Aufmerksamkeit.</h1>
        </div>
        <button className={styles.primaryAction}>Aufgabe anlegen</button>
      </header>

      <main className={styles.shell}>
        <section className={styles.todayPanel} aria-labelledby="today-title">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Heute</p>
              <h2 id="today-title">3 Aufgaben faellig</h2>
            </div>
            <span className={styles.statusBadge}>Morgendruck aktiv</span>
          </div>

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
                  <p>{task.tone}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.sidePanel} aria-label="Planungsuebersicht">
          <section>
            <p className={styles.eyebrow}>Haushalt</p>
            <h2>Sandra & Haushalt</h2>
            <p>
              Sprint 0 zeigt erst statische Beispieldaten. Statisch bedeutet:
              Die Daten stehen noch fest im Code und kommen noch nicht aus einer
              Datenbank.
            </p>
          </section>

          <section>
            <p className={styles.eyebrow}>Demnaechst</p>
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
