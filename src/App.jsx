import { useMemo, useState } from 'react'
import './App.css'
import FileLoader from './components/FileLoader'
import NodeDetails from './components/NodeDetails'
import NodeTree from './components/NodeTree'
import Timeline from './components/Timeline'
import { buildShowcaseIndex, parseShowcaseText } from './data/rollingShowcase'

function App() {
  const [showcaseData, setShowcaseData] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const showcaseIndex = useMemo(() => {
    if (!showcaseData) return null
    return buildShowcaseIndex(showcaseData)
  }, [showcaseData])

  const selectedNode = showcaseIndex?.nodeById.get(selectedNodeId) ?? null
  const relatedLinks = selectedNodeId ? showcaseIndex?.relationsByNode.get(selectedNodeId) ?? [] : []

  const handleFileLoaded = (fileText, nextFileName) => {
    const parsed = parseShowcaseText(fileText)

    if (!parsed.valid) {
      setShowcaseData(null)
      setSelectedNodeId(null)
      setError(parsed.error)
      return
    }

    setError('')
    setShowcaseData(parsed.data)
    setSelectedNodeId(null)
    setFileName(nextFileName)
  }

  if (!showcaseData) {
    return (
      <main className="app-shell single">
        <FileLoader onFileLoaded={handleFileLoaded} error={error} />
      </main>
    )
  }

  const window = showcaseData.meta.window

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <section className="panel compact">
          <h2>Источник</h2>
          <p>{fileName}</p>
          <button type="button" onClick={() => setShowcaseData(null)}>
            Загрузить другой файл
          </button>
        </section>

        <section className="panel compact">
          <h2>Окно</h2>
          <p>{window.start_date} → {window.end_date}</p>
          <p>Granularity: {window.granularity_mode}</p>
          <p>Дней: {showcaseIndex.days.length}</p>
        </section>

        <NodeTree
          childrenByParent={showcaseIndex.childrenByParent}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />

        <NodeDetails node={selectedNode} relatedLinks={relatedLinks} />
      </aside>

      <Timeline days={showcaseIndex.days} selectedNodeId={selectedNodeId} />
    </main>
  )
}

export default App
