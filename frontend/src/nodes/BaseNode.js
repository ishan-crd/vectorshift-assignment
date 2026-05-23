import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_TYPES } from '../nodeConfig';

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
        <select value={value ?? ''} onChange={(e) => onChange(field.key, e.target.value)}>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
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

// Renders a full node card from config. Used by all node types except Text (which extends this).
export function BaseNode({ id, config, data, inputs: inputsOverride, children }) {
  const [fields, setFields] = useState(() => {
    const init = {};
    config.fields.forEach((f) => {
      init[f.key] = data?.[f.key] ?? config.defaults[f.key] ?? '';
    });
    return init;
  });

  const handleFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const inputs = inputsOverride || config.inputs;
  const outputs = config.outputs;
  const isNote = config.kind === 'STICKY';

  return (
    <div className={`node ${isNote ? 'note' : ''}`} data-cat={config.cat}>
      {/* header */}
      <div className="node-header">
        <span className="node-cat" />
        <span className="node-title">{config.label}</span>
        <span className="node-kind">{config.kind}</span>
      </div>

      {/* body */}
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

      {/* input handles */}
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

      {/* output handles */}
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
    </div>
  );
}

// Factory to create a node component from a config key
export function createNode(typeKey) {
  const config = NODE_TYPES[typeKey];
  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} config={config} data={data} />
  );
  NodeComponent.displayName = config.label + 'Node';
  return NodeComponent;
}
