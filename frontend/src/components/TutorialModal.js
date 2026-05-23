import { useState, useCallback } from 'react';

const steps = [
  {
    title: 'Drag & drop nodes',
    description: 'Grab any node from the toolbar and drop it onto the canvas to add it to your pipeline.',
    animation: 'drag',
  },
  {
    title: 'Connect nodes',
    description: 'Click on an output handle (green) and drag to an input handle (purple) on another node to create a connection.',
    animation: 'connect',
  },
  {
    title: 'Edit properties',
    description: 'Click on any field inside a node to edit its properties — models, prompts, conditions, and more.',
    animation: 'edit',
  },
  {
    title: 'Use variables in Text',
    description: 'Type {{variableName}} in a Text node to create dynamic input handles that other nodes can connect to.',
    animation: 'variable',
  },
  {
    title: 'Right-click to delete',
    description: 'Right-click any node to open a context menu. You can delete nodes and undo with \u2318Z.',
    animation: 'context',
  },
  {
    title: 'Submit your pipeline',
    description: 'Click Submit to send your pipeline to the backend. It checks node count, edge count, and whether it\'s a valid DAG.',
    animation: 'submit',
  },
];

function StepIllustration({ animation }) {
  return (
    <div className="tut-illustration">
      <div className={`tut-scene tut-scene--${animation}`}>
        {animation === 'drag' && (
          <>
            <div className="tut-toolbar-mini">
              <div className="tut-chip-mini">LLM</div>
              <div className="tut-chip-mini tut-chip-source">Input</div>
              <div className="tut-chip-mini">Text</div>
            </div>
            <div className="tut-drag-group">
              <div className="tut-ghost-node">Input</div>
              <img src={process.env.PUBLIC_URL + '/cursor.svg'} alt="" className="tut-cursor tut-cursor-attached" />
            </div>
          </>
        )}
        {animation === 'connect' && (
          <div className="tut-canvas-mini">
            <div className="tut-mini-node tut-connect-left">
              <span>Text</span>
              <div className="tut-handle-out" />
            </div>
            <svg className="tut-edge-line" viewBox="0 0 100 40">
              <path d="M10 20 C 40 20, 60 20, 90 20" className="tut-edge-anim" />
            </svg>
            <div className="tut-mini-node tut-connect-right">
              <div className="tut-handle-in" />
              <span>Input</span>
            </div>
          </div>
        )}
        {animation === 'edit' && (
          <div className="tut-canvas-mini">
            <div className="tut-edit-card">
              <div className="tut-edit-header">LLM <span>MODEL</span></div>
              <div className="tut-edit-field">
                <div className="tut-edit-label">MODEL</div>
                <div className="tut-edit-input">
                  <span className="tut-typing">claude-sonnet-4.5</span>
                </div>
              </div>
              <div className="tut-edit-field">
                <div className="tut-edit-label">TEMPERATURE</div>
                <div className="tut-edit-input">0.7</div>
              </div>
            </div>
          </div>
        )}
        {animation === 'variable' && (
          <div className="tut-canvas-mini">
            <div className="tut-var-card">
              <div className="tut-edit-header">Text <span>TEMPLATE</span></div>
              <div className="tut-var-field">
                <span className="tut-var-typing">{'Summarize: {{'}
                  <strong>query</strong>
                  {'}}'}</span>
              </div>
              <div className="tut-var-handle">
                <div className="tut-handle-in" />
                <span>query</span>
              </div>
            </div>
          </div>
        )}
        {animation === 'context' && (
          <div className="tut-canvas-mini">
            <div className="tut-mini-node tut-ctx-node">
              <span>Filter</span>
            </div>
            <div className="tut-ctx-menu-mini">
              <div className="tut-ctx-item-mini danger">{'\u2715'} Delete</div>
            </div>
            <img src={process.env.PUBLIC_URL + '/cursor.svg'} alt="" className="tut-cursor tut-cursor-ctx" />
          </div>
        )}
        {animation === 'submit' && (
          <div className="tut-canvas-mini tut-submit-scene">
            <div className="tut-submit-btn-mini">Submit pipeline {'\u2192'}</div>
            <div className="tut-toast-mini">
              <span className="tut-toast-ok">{'\u2713'}</span>
              Pipeline submitted
              <span className="tut-toast-stats">4 nodes {'\u00B7'} 3 edges {'\u00B7'} DAG: yes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const next = useCallback(() => {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  }, [isLast, onClose]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="tut-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tut-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </button>

        <StepIllustration animation={current.animation} />

        <div className="tut-content">
          <div className="tut-step-label">Step {step + 1} of {steps.length}</div>
          <h3 className="tut-title">{current.title}</h3>
          <p className="tut-desc">{current.description}</p>
        </div>

        <div className="tut-footer">
          <div className="tut-dots">
            {steps.map((_, i) => (
              <button
                key={i}
                className={`tut-dot ${i === step ? 'active' : ''}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          <div className="tut-nav">
            {step > 0 && (
              <button className="btn" onClick={prev}>Back</button>
            )}
            <button className="btn primary" onClick={next}>
              {isLast ? 'Get started' : 'Next'}
              <span className="arrow">{isLast ? '\u2713' : '\u2192'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
