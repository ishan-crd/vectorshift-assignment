export const DraggableNode = ({ type, label, glyph, cat }) => {
  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="chip"
      data-cat={cat}
      draggable
      onDragStart={onDragStart}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
    >
      <span className="glyph">{glyph}</span>
      {label}
    </div>
  );
};
