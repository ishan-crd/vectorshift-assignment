import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitBar = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [toast, setToast] = useState(null);

  const showToast = (title, stats) => {
    setToast({ title, stats });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      showToast(
        'Pipeline submitted',
        `${data.num_nodes} nodes \u00B7 ${data.num_edges} edges \u00B7 DAG: ${data.is_dag ? 'yes' : 'no'}`
      );
    } catch {
      showToast('Connection failed', 'Could not reach backend');
    }
  };

  const handleValidate = () => {
    if (nodes.length === 0) {
      showToast('Validation failed', 'Pipeline is empty');
      return;
    }
    // check that every node with inputs has at least one edge connected
    const targetIds = new Set(edges.map((e) => e.target));
    const unconnected = nodes.filter(
      (n) => n.type !== 'customInput' && n.type !== 'note' && n.type !== 'timer' && !targetIds.has(n.id)
    );
    if (unconnected.length > 0) {
      showToast('Validation warning', `${unconnected.length} node(s) have no input connections`);
    } else {
      showToast('Validation passed', `${nodes.length} nodes \u00B7 ${edges.length} edges \u00B7 all connected`);
    }
  };

  const handleTestRun = async () => {
    // same as submit but framed as a test
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      if (!data.is_dag) {
        showToast('Test failed', 'Pipeline contains cycles \u2014 not a valid DAG');
      } else {
        showToast('Test passed', `DAG verified \u00B7 ${data.num_nodes} nodes \u00B7 ${data.num_edges} edges`);
      }
    } catch {
      showToast('Test failed', 'Could not reach backend');
    }
  };

  return (
    <>
      <div className="submit-bar">
        <div className="submit-meta">
          <span className="stat"><strong>{nodes.length}</strong> nodes</span>
          <span className="stat"><strong>{edges.length}</strong> edges</span>
        </div>

        <button className="btn primary" onClick={handleSubmit}>
          Submit pipeline
          <span className="arrow">{'\u2192'}</span>
          <span className="kbd">{'\u2318\u23CE'}</span>
        </button>

        <div className="submit-actions">
          <button className="btn" onClick={handleValidate}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8.5L6.5 12L13 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Validate
          </button>
          <button className="btn" onClick={handleTestRun}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 3l8 5-8 5V3z" fill="currentColor" stroke="none" />
            </svg>
            Test run
          </button>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>
        {toast && (
          <>
            <span className="ok">{'\u2713'}</span>
            <span>{toast.title}</span>
            <span className="stats">{toast.stats}</span>
          </>
        )}
      </div>
    </>
  );
};
