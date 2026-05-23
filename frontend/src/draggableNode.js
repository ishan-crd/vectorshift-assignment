import { useStore } from './store';

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export const DraggableNode = ({ type, label, glyph, cat }) => {
  const addNode = useStore((s) => s.addNode);
  const getNodeID = useStore((s) => s.getNodeID);

  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  // on touch devices, tap to add node at a default canvas position
  const handleClick = () => {
    if (!isTouchDevice()) return;
    const nodeID = getNodeID(type);
    addNode({
      id: nodeID,
      type,
      position: { x: 100 + Math.random() * 150, y: 100 + Math.random() * 150 },
      data: { id: nodeID, nodeType: type },
    });
  };

  return (
    <div
      className="chip"
      data-cat={cat}
      draggable
      onDragStart={onDragStart}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
      onClick={handleClick}
    >
      <span className="glyph">{glyph}</span>
      {label}
    </div>
  );
};
