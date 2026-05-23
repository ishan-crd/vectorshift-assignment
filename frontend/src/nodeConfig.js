export const NODE_TYPES = {
  customInput: {
    label: 'Input',
    kind: 'INPUT',
    cat: 'io',
    glyph: 'IN',
    inputs: [],
    outputs: [{ id: 'value', label: 'value' }],
    fields: [
      { key: 'name', label: 'name', type: 'text' },
      { key: 'type', label: 'type', type: 'select', options: ['Text', 'File', 'Audio', 'Image'] },
    ],
    defaults: { name: 'user_query', type: 'Text' },
    tags: ['entry', 'trigger'],
  },
  llm: {
    label: 'LLM',
    kind: 'MODEL',
    cat: 'ai',
    glyph: 'AI',
    inputs: [
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ],
    outputs: [{ id: 'response', label: 'response' }],
    fields: [
      { key: 'model', label: 'model', type: 'select', options: [
        'claude-haiku-4.5', 'claude-sonnet-4.5', 'claude-opus-4', 'gpt-4o', 'gemini-2.0-pro',
      ]},
      { key: 'temperature', label: 'temperature', type: 'number', step: 0.1, min: 0, max: 2 },
      { key: 'maxTokens', label: 'max tokens', type: 'number', step: 64, min: 1 },
    ],
    defaults: { model: 'claude-haiku-4.5', temperature: 0.7, maxTokens: 1024 },
  },
  customOutput: {
    label: 'Output',
    kind: 'OUTPUT',
    cat: 'io',
    glyph: 'OUT',
    inputs: [{ id: 'value', label: 'value' }],
    outputs: [],
    fields: [
      { key: 'name', label: 'name', type: 'text' },
      { key: 'type', label: 'type', type: 'select', options: ['Text', 'JSON', 'File', 'Markdown'] },
    ],
    defaults: { name: 'result', type: 'Text' },
    tags: ['exit'],
  },
  text: {
    label: 'Text',
    kind: 'TEMPLATE',
    cat: 'text',
    glyph: 'T',
    inputs: [],
    outputs: [{ id: 'output', label: 'text' }],
    fields: [
      { key: 'content', label: 'template', type: 'textarea' },
    ],
    defaults: { content: '{{input}}' },
  },
  note: {
    label: 'Note',
    kind: 'STICKY',
    cat: 'util',
    glyph: '//',
    inputs: [],
    outputs: [],
    fields: [
      { key: 'content', label: null, type: 'textarea' },
    ],
    defaults: { content: '' },
  },
  api: {
    label: 'API',
    kind: 'HTTP',
    cat: 'util',
    glyph: '{ }',
    inputs: [{ id: 'body', label: 'body' }],
    outputs: [{ id: 'response', label: 'response' }],
    fields: [
      { key: 'url', label: 'endpoint', type: 'text' },
      { key: 'method', label: 'method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
    ],
    defaults: { url: '', method: 'GET' },
  },
  timer: {
    label: 'Timer',
    kind: 'TRIGGER',
    cat: 'util',
    glyph: '\u231B',
    inputs: [],
    outputs: [{ id: 'tick', label: 'tick' }],
    fields: [
      { key: 'every', label: 'every', type: 'number', min: 1 },
      { key: 'unit', label: 'unit', type: 'select', options: ['seconds', 'minutes', 'hours', 'days'] },
    ],
    defaults: { every: 15, unit: 'minutes' },
  },
  merge: {
    label: 'Merge',
    kind: 'MERGE',
    cat: 'logic',
    glyph: '\u22C8',
    inputs: [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b' },
    ],
    outputs: [{ id: 'out', label: 'merged' }],
    fields: [
      { key: 'strategy', label: 'strategy', type: 'select', options: ['concat', 'object', 'array'] },
    ],
    defaults: { strategy: 'concat' },
  },
  filter: {
    label: 'Filter',
    kind: 'FILTER',
    cat: 'logic',
    glyph: '\u2248',
    inputs: [{ id: 'input', label: 'input' }],
    outputs: [
      { id: 'pass', label: 'pass' },
      { id: 'drop', label: 'drop' },
    ],
    fields: [
      { key: 'condition', label: 'condition', type: 'text' },
      { key: 'mode', label: 'mode', type: 'select', options: ['include', 'exclude'] },
    ],
    defaults: { condition: '', mode: 'include' },
  },
};

export const TOOLBAR_ORDER = ['customInput', 'llm', 'customOutput', 'text', 'note', 'api', 'timer', 'merge', 'filter'];
