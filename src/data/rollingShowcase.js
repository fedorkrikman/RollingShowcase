const REQUIRED_ROOT_FIELDS = ['meta', 'nodes', 'relations', 'days']

const formatError = (message) => ({ valid: false, error: message })

export function parseShowcaseText(text) {
  let parsed

  try {
    parsed = JSON.parse(text)
  } catch {
    return formatError('Файл не является валидным JSON.')
  }

  return validateShowcaseData(parsed)
}

export function validateShowcaseData(data) {
  if (!data || typeof data !== 'object') {
    return formatError('Ожидается JSON-объект верхнего уровня.')
  }

  const missingFields = REQUIRED_ROOT_FIELDS.filter((field) => !(field in data))
  if (missingFields.length > 0) {
    return formatError(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`)
  }

  if (!Array.isArray(data.nodes) || !Array.isArray(data.relations) || !Array.isArray(data.days)) {
    return formatError('Поля nodes, relations и days должны быть массивами.')
  }

  const window = data.meta?.window
  if (!window?.start_date || !window?.end_date || !window?.granularity_mode) {
    return formatError('В meta.window должны быть start_date, end_date и granularity_mode.')
  }

  const invalidDay = data.days.find((day) => !day?.date || !Array.isArray(day?.entries))
  if (invalidDay) {
    return formatError('Каждый элемент days должен содержать date и массив entries.')
  }

  return { valid: true, data }
}

export function buildShowcaseIndex(data) {
  const nodes = data.nodes ?? []
  const relations = data.relations ?? []
  const days = [...(data.days ?? [])].sort((a, b) => a.date.localeCompare(b.date))

  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const childrenByParent = new Map()

  nodes.forEach((node) => {
    const parentKey = node.parent_id ?? '__root__'
    if (!childrenByParent.has(parentKey)) {
      childrenByParent.set(parentKey, [])
    }
    childrenByParent.get(parentKey).push(node)
  })

  const occurrencesByNode = new Map()

  days.forEach((day) => {
    day.entries.forEach((entry) => {
      if (!entry?.node_id) return
      if (!occurrencesByNode.has(entry.node_id)) {
        occurrencesByNode.set(entry.node_id, [])
      }
      occurrencesByNode.get(entry.node_id).push({ date: day.date, entry })
    })
  })

  const relationsByNode = new Map()
  relations.forEach((relation) => {
    const fromList = relationsByNode.get(relation.from) ?? []
    fromList.push({ direction: 'outgoing', relation })
    relationsByNode.set(relation.from, fromList)

    const toList = relationsByNode.get(relation.to) ?? []
    toList.push({ direction: 'incoming', relation })
    relationsByNode.set(relation.to, toList)
  })

  return {
    days,
    nodeById,
    childrenByParent,
    occurrencesByNode,
    relationsByNode,
  }
}
