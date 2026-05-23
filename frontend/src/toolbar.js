import { DraggableNode } from './draggableNode';
import { NODE_TYPES, TOOLBAR_ORDER } from './nodeConfig';

export const PipelineToolbar = () => {
  return (
    <div className="toolbar">
      <span className="toolbar-label">Nodes</span>
      {TOOLBAR_ORDER.map((typeKey) => {
        const config = NODE_TYPES[typeKey];
        return (
          <DraggableNode
            key={typeKey}
            type={typeKey}
            label={config.label}
            glyph={config.glyph}
            cat={config.cat}
          />
        );
      })}
    </div>
  );
};
