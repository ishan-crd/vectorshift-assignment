import { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_TYPES } from '../nodeConfig';
import { Select } from '../components/Select';
import { ContextMenu } from '../components/ContextMenu';
import { useStore } from '../store';

function Field({ field, value, onChange }) {
  return (
    <div className="field">
      {field.label && <div className="field-label">{field.label}</div>}
      {field.type === 'text' && (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
      {field.type === 'number' && (
        <input
          type="number"
          value={value ?? ''}
          step={field.step}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
        />
      )}
      {field.type === 'select' && (
        <Select
          value={value ?? ''}
          options={field.options}
          onChange={(v) => onChange(field.key, v)}
        />
      )}
      {field.type === 'textarea' && (
        <textarea
          value={value ?? ''}
          rows={3}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
    </div>
  );
}

export function BaseNode({ id, config, data, inputs: inputsOverride, children }) {
  const [fields, setFields] = useState(() => {
    const init = {};
    config.fields.forEach((f) => {
      init[f.key] = data?.[f.key] ?? config.defaults[f.key] ?? '';
    });
    return init;
  });
  const [ctxMenu, setCtxMenu] = useState(null);

  const deleteNode = useStore((s) => s.deleteNode);
  const duplicateNode = useStore((s) => s.duplicateNode);

  const handleFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const inputs = inputsOverride || config.inputs;
  const outputs = config.outputs;
  const isNote = config.kind === 'STICKY';

  const menuItems = [
    { key: 'duplicate', label: 'Duplicate', shortcut: '\u2318D', icon: '\u29C9', action: () => duplicateNode(id) },
    { key: 'sep1', separator: true },
    { key: 'delete', label: 'Delete', shortcut: '\u232B', icon: '\u2715', danger: true, action: () => deleteNode(id) },
  ];

  return (
    <div
      className={`node ${isNote ? 'note' : ''}`}
      data-cat={config.cat}
      onContextMenu={onContextMenu}
    >
      <div className="node-header">
        <span className="node-cat" />
        <span className="node-title">{config.label}</span>
        <span className="node-kind">{config.kind}</span>
      </div>

      <div className="node-body">
        {children || config.fields.map((f) => (
          <Field
            key={f.key}
            field={f}
            value={fields[f.key]}
            onChange={handleFieldChange}
          />
        ))}
        {config.tags && (
          <div className="tag-row">
            {config.tags.map((t, i) => (
              <span key={t} className={`tag ${i === 0 ? 'accent' : ''}`}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {inputs.map((h, i) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          className="handle-in"
          style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
        >
          <span className="handle-label-left">{h.label}</span>
        </Handle>
      ))}

      {outputs.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          className="handle-out"
          style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
        >
          <span className="handle-label-right">{h.label}</span>
        </Handle>
      ))}

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          items={menuItems}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </div>
  );
}

export function createNode(typeKey) {
  const config = NODE_TYPES[typeKey];
  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} config={config} data={data} />
  );
  NodeComponent.displayName = config.label + 'Node';
  return NodeComponent;
}
