export default function NodeDetails({ node, relatedLinks }) {
  if (!node) {
    return (
      <section className="panel">
        <h2>Детали узла</h2>
        <p className="muted">Выберите узел в дереве слева, чтобы увидеть детали и связи.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>{node.title}</h2>
      <p>{node.summary}</p>
      <dl className="meta-grid">
        <dt>ID</dt>
        <dd>{node.id}</dd>
        <dt>Тип</dt>
        <dd>{node.type}</dd>
        <dt>Статус</dt>
        <dd>{node.status}</dd>
        <dt>Actional depth</dt>
        <dd>{node.actional_depth}</dd>
        <dt>Активный диапазон</dt>
        <dd>
          {node.active_range?.start ?? '—'} → {node.active_range?.end ?? '—'}
        </dd>
      </dl>

      <h3>Aliases</h3>
      {node.aliases?.length ? (
        <ul>
          {node.aliases.map((alias) => (
            <li key={`${alias.title}-${alias.from ?? ''}-${alias.to ?? ''}`}>
              {alias.title} ({alias.from ?? '—'} → {alias.to ?? '—'})
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Нет альтернативных названий.</p>
      )}

      <h3>Relations</h3>
      {relatedLinks?.length ? (
        <ul>
          {relatedLinks.map(({ direction, relation }, index) => (
            <li key={`${relation.type}-${relation.from}-${relation.to}-${index}`}>
              <strong>{direction === 'outgoing' ? '→' : '←'} {relation.type}</strong> {relation.from} → {relation.to}
              {' '}[{relation.confidence}]
              {relation.note ? ` — ${relation.note}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Связей для узла нет.</p>
      )}
    </section>
  )
}
