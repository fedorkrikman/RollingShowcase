function EntryCard({ entry, highlight }) {
  return (
    <article className={`entry-card ${highlight ? 'highlight' : ''}`}>
      <header>
        <strong>{entry.node_id}</strong>
        <span>{entry.phase}</span>
      </header>
      <ul>
        {(entry.events ?? []).map((event, idx) => (
          <li key={`${entry.node_id}-${idx}`}>{event}</li>
        ))}
      </ul>
    </article>
  )
}

export default function Timeline({ days, selectedNodeId }) {
  return (
    <section className="panel timeline-panel">
      <h2>Таймлайн</h2>
      <div className="days-list">
        {days.map((day) => {
          const nodeEntries = selectedNodeId
            ? day.entries.filter((entry) => entry.node_id === selectedNodeId)
            : day.entries

          return (
            <article className="day-card" key={day.date}>
              <header className="panel-header-row">
                <h3>{day.date}</h3>
                <span>{nodeEntries.length} entries</span>
              </header>

              {nodeEntries.length === 0 ? <p className="muted">Нет событий для выбранного узла.</p> : null}
              {nodeEntries.map((entry, index) => (
                <EntryCard key={`${day.date}-${entry.node_id}-${index}`} entry={entry} highlight={Boolean(selectedNodeId)} />
              ))}

              <div className="orphans">
                <h4>Orphans</h4>
                {day.orphan?.length ? (
                  <ul>
                    {day.orphan.map((event, index) => (
                      <li key={`${day.date}-orphan-${index}`}>{event}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Пусто</p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
