function TreeBranch({ parentId, childrenByParent, selectedNodeId, onSelectNode, level = 0 }) {
  const nodes = childrenByParent.get(parentId) ?? []

  return (
    <ul className="tree-list" style={{ paddingLeft: `${level * 12}px` }}>
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            className={`tree-node ${selectedNodeId === node.id ? 'active' : ''}`}
            onClick={() => onSelectNode(node.id)}
            type="button"
          >
            {node.title}
          </button>
          <TreeBranch
            parentId={node.id}
            childrenByParent={childrenByParent}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            level={level + 1}
          />
        </li>
      ))}
    </ul>
  )
}

export default function NodeTree({ childrenByParent, selectedNodeId, onSelectNode }) {
  return (
    <section className="panel">
      <div className="panel-header-row">
        <h2>Узлы</h2>
        <button type="button" onClick={() => onSelectNode(null)}>
          Сбросить
        </button>
      </div>
      <TreeBranch
        parentId="__root__"
        childrenByParent={childrenByParent}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
      />
    </section>
  )
}
