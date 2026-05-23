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

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      setToast({
        title: 'Pipeline submitted',
        stats: `${data.num_nodes} nodes \u00B7 ${data.num_edges} edges \u00B7 DAG: ${data.is_dag ? 'yes' : 'no'}`,
      });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ title: 'Connection failed', stats: 'Could not reach backend' });
      setTimeout(() => setToast(null), 3000);
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
          <span className="arrow">&rarr;</span>
          <span className="kbd">&amp;#8984;&crarr;</span>
        </button>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>
        {toast && (
          <>
            <span className="ok">&check;</span>
            <span>{toast.title}</span>
            <span className="stats">{toast.stats}</span>
          </>
        )}
      </div>
    </>
  );
};
