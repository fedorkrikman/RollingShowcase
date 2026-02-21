export default function FileLoader({ onFileLoaded, error }) {
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    onFileLoaded(text, file.name)
    event.target.value = ''
  }

  return (
    <section className="panel upload-panel">
      <h1>Rolling Showcase Viewer</h1>
      <p className="muted">Загрузите JSON cо схемой rolling_showcase_graph_v0.3 через File Picker.</p>
      <label className="file-picker" htmlFor="showcase-file">
        Выбрать JSON файл
      </label>
      <input id="showcase-file" type="file" accept="application/json,.json" onChange={handleFileChange} />
      {error ? <p className="error">{error}</p> : null}
    </section>
  )
}
