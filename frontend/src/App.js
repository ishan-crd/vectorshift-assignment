import { useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitBar } from './submit';
import { ConfirmModal } from './components/ConfirmModal';
import { TutorialModal } from './components/TutorialModal';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({
  undo: s.undo,
  redo: s.redo,
  clearAll: s.clearAll,
  loadDemo: s.loadDemo,
  canUndo: s.past.length > 0,
  canRedo: s.future.length > 0,
  nodeCount: s.nodes.length,
});

function App() {
  const { undo, redo, clearAll, loadDemo, canUndo, canRedo, nodeCount } = useStore(selector, shallow);
  const [showClear, setShowClear] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          vector
          <small>pipelines / untitled-7</small>
        </div>
        <div className="topbar-tabs">
          <button className="active">Build</button>
          <button>Test</button>
          <button>Deploy</button>
          <button>Logs</button>
        </div>
        <div className="topbar-right">
          <button className="tut-btn" title="Tutorial" onClick={() => setShowTutorial(true)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M6 6.5a2 2 0 0 1 3.94.5c0 1-1.44 1.25-1.44 2.25" strokeLinecap="round" />
              <circle cx="8.5" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <span className="pill"><span className="dot" /> autosaved</span>
          <div className="topbar-actions">
            <button className="icon-btn" title="Undo (⌘Z)" disabled={!canUndo} onClick={undo}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7h7a3 3 0 0 1 0 6H9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 4L3 7l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="icon-btn" title="Redo (⌘⇧Z)" disabled={!canRedo} onClick={redo}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 7H6a3 3 0 0 0 0 6h1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="topbar-sep" />
            <button className="demo-btn" title="Load demo pipeline" onClick={loadDemo}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 3l8 5-8 5V3z" fill="currentColor" stroke="none" />
              </svg>
              Demo
            </button>
            <button
              className="icon-btn"
              title="Clear canvas"
              disabled={nodeCount === 0}
              onClick={() => setShowClear(true)}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 4h10M6.5 4V2.5h3V4M5 4l.5 9h5L11 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitBar />

      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {showClear && (
        <ConfirmModal
          title="Clear pipeline"
          message="This will remove all nodes and connections from the canvas. You can undo this action."
          confirmLabel="Clear all"
          onCancel={() => setShowClear(false)}
          onConfirm={() => { clearAll(); setShowClear(false); }}
        />
      )}
    </div>
  );
}

export default App;
