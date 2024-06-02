import React from 'react';

const Note = ({ note, onDelete, onEdit, onDoubleClick }) => {
  const truncateContent = (content) => {
    const maxLength = 100; // Limitar a 100 caracteres
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="note" onDoubleClick={onDoubleClick}>
      <div className="note-content">{truncateContent(note.content)}</div>
      <button onClick={() => onEdit(note)}>Edit</button>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
};

export default Note;
