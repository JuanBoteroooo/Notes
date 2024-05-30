import React from 'react';

const Note = ({ note, onDelete, onEdit }) => {
  return (
    <div className="note">
      <p>{note.content}</p>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
};

export default Note;
