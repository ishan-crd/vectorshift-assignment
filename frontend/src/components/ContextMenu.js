import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="ctx-menu"
      ref={ref}
      style={{ position: 'fixed', left: x, top: y, zIndex: 200 }}
    >
      {items.map((item) =>
        item.separator ? (
          <div key={item.key} className="ctx-sep" />
        ) : (
          <button
            key={item.key}
            className={`ctx-item ${item.danger ? 'danger' : ''}`}
            onClick={() => { item.action(); onClose(); }}
          >
            <span className="ctx-icon">{item.icon}</span>
            {item.label}
            {item.shortcut && <span className="ctx-shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>,
    document.body
  );
}
