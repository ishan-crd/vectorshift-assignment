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
