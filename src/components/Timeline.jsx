import { useMemo } from 'react'

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

const hasEvents = (events) => Array.isArray(events) && events.length > 0

const collectOrphanEvents = (dayEntries, dayOrphan) => {
  const orphanEventsFromDay = Array.isArray(dayOrphan) ? dayOrphan.filter(Boolean) : []
  const orphanEventsFromEntries = dayEntries
    .filter((entry) => entry?.type === 'orphan' && hasEvents(entry?.events))
    .flatMap((entry) => entry.events)

  return [...orphanEventsFromDay, ...orphanEventsFromEntries]
}

export default function Timeline({ days, selectedNodeId }) {
  const visibleDays = useMemo(() => {
    return days
      .map((day) => {
        const entries = Array.isArray(day?.entries) ? day.entries : []

        if (selectedNodeId) {
          const nodeEntries = entries.filter((entry) => entry?.node_id === selectedNodeId && hasEvents(entry?.events))
          if (nodeEntries.length === 0) return null

          return {
            date: day.date,
            nodeEntries,
            orphanEvents: [],
          }
        }

        const nodeEntries = entries.filter((entry) => entry?.node_id && hasEvents(entry?.events))
        const orphanEvents = collectOrphanEvents(entries, day?.orphan)

        if (nodeEntries.length === 0 && orphanEvents.length === 0) return null

        return {
          date: day.date,
          nodeEntries,
          orphanEvents,
        }
      })
      .filter(Boolean)
  }, [days, selectedNodeId])

  return (
    <section className="panel timeline-panel">
      <h2>Timeline</h2>
      {visibleDays.length === 0 ? (
        <p className="muted">
          {selectedNodeId ? 'No events for the selected node in the current window.' : 'No events in the current window.'}
        </p>
      ) : (
        <div className="days-list">
          {visibleDays.map((day) => (
            <article className="day-card" key={day.date}>
              <header className="panel-header-row">
                <h3>{day.date}</h3>
                <span>{day.nodeEntries.length} entries</span>
              </header>

              {day.nodeEntries.map((entry, index) => (
                <EntryCard key={`${day.date}-${entry.node_id}-${index}`} entry={entry} highlight={Boolean(selectedNodeId)} />
              ))}

              {!selectedNodeId ? (
                <div className="orphans">
                  <h4>Orphans</h4>
                  {day.orphanEvents.length ? (
                    <ul>
                      {day.orphanEvents.map((event, index) => (
                        <li key={`${day.date}-orphan-${index}`}>{event}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">Empty</p>
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
