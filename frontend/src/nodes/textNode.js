import { useState, useEffect, useRef } from 'react';
import { NODE_TYPES } from '../nodeConfig';
import { BaseNode } from './BaseNode';

const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return [...vars];
};

export const TextNode = ({ id, data }) => {
  const config = NODE_TYPES.text;
  const [content, setContent] = useState(data?.content ?? config.defaults.content);
  const textareaRef = useRef(null);
  const variables = extractVariables(content);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [content]);

  // Dynamic inputs from detected variables
  const dynamicInputs = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode id={id} config={config} data={data} inputs={dynamicInputs}>
      <div className="field">
        <div className="field-label">template</div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          style={{ overflow: 'hidden' }}
        />
      </div>
    </BaseNode>
  );
};
