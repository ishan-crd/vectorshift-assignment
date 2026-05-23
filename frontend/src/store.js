import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const MAX_HISTORY = 50;

// saves a snapshot before state-changing actions
function pushHistory(get, set) {
  const { nodes, edges, past, future } = get();
  set({
    past: [...past.slice(-(MAX_HISTORY - 1)), { nodes, edges }],
    future: [],
  });
}

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  past: [],
  future: [],

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) newIDs[type] = 0;
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    pushHistory(get, set);
    set({ nodes: [...get().nodes, node] });
  },

  onNodesChange: (changes) => {
    // only snapshot on removals, not on every drag pixel
    const hasRemoval = changes.some((c) => c.type === 'remove');
    if (hasRemoval) pushHistory(get, set);
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    const hasRemoval = changes.some((c) => c.type === 'remove');
    if (hasRemoval) pushHistory(get, set);
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    pushHistory(get, set);
    set({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } },
        get().edges
      ),
    });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future.slice(0, MAX_HISTORY - 1)],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: future.slice(1),
    });
  },

  clearAll: () => {
    pushHistory(get, set);
    set({ nodes: [], edges: [] });
  },

  loadDemo: () => {
    pushHistory(get, set);

    const edge = (id, source, sourceHandle, target, targetHandle) => ({
      id,
      source,
      sourceHandle,
      target,
      targetHandle,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
    });

    set({
      nodes: [
        { id: 'customInput-1', type: 'customInput', position: { x: 60, y: 100 },
          data: { id: 'customInput-1', nodeType: 'customInput', name: 'user_query', type: 'Text' } },

        { id: 'timer-1', type: 'timer', position: { x: 60, y: 380 },
          data: { id: 'timer-1', nodeType: 'timer', every: 30, unit: 'minutes' } },

        { id: 'api-1', type: 'api', position: { x: 360, y: 100 },
          data: { id: 'api-1', nodeType: 'api', url: 'https://api.example.com/v1/search', method: 'POST' } },

        { id: 'merge-1', type: 'merge', position: { x: 360, y: 380 },
          data: { id: 'merge-1', nodeType: 'merge', strategy: 'concat' } },

        { id: 'text-1', type: 'text', position: { x: 60, y: 580 },
          data: { id: 'text-1', nodeType: 'text', content: 'You are a helpful research assistant.\nAlways cite your sources.' } },

        { id: 'text-2', type: 'text', position: { x: 660, y: 200 },
          data: { id: 'text-2', nodeType: 'text', content: 'Context:\n{{context}}\n\nQuery: {{query}}\n\nProvide a detailed summary.' } },

        { id: 'llm-1', type: 'llm', position: { x: 980, y: 260 },
          data: { id: 'llm-1', nodeType: 'llm', model: 'claude-sonnet-4.5', temperature: 0.7, maxTokens: 1024 } },

        { id: 'filter-1', type: 'filter', position: { x: 1280, y: 220 },
          data: { id: 'filter-1', nodeType: 'filter', condition: 'length > 100', mode: 'include' } },

        { id: 'customOutput-1', type: 'customOutput', position: { x: 1280, y: 480 },
          data: { id: 'customOutput-1', nodeType: 'customOutput', name: 'result', type: 'Markdown' } },

        { id: 'note-1', type: 'note', position: { x: 980, y: 520 },
          data: { id: 'note-1', nodeType: 'note', content: 'Swap model to claude-opus-4\nfor harder research queries.' } },
      ],
      edges: [
        edge('e1', 'customInput-1', 'customInput-1-value', 'api-1', 'api-1-body'),
        edge('e2', 'api-1', 'api-1-response', 'merge-1', 'merge-1-a'),
        edge('e3', 'timer-1', 'timer-1-tick', 'merge-1', 'merge-1-b'),
        edge('e4', 'customInput-1', 'customInput-1-value', 'text-2', 'text-2-query'),
        edge('e5', 'merge-1', 'merge-1-out', 'text-2', 'text-2-context'),
        edge('e6', 'text-1', 'text-1-output', 'llm-1', 'llm-1-system'),
        edge('e7', 'text-2', 'text-2-output', 'llm-1', 'llm-1-prompt'),
        edge('e8', 'llm-1', 'llm-1-response', 'filter-1', 'filter-1-input'),
        edge('e9', 'filter-1', 'filter-1-pass', 'customOutput-1', 'customOutput-1-value'),
      ],
      // set counters so new nodes don't collide
      nodeIDs: {
        customInput: 1, timer: 1, api: 1, merge: 1,
        text: 2, llm: 1, filter: 1, customOutput: 1, note: 1,
      },
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
}));
