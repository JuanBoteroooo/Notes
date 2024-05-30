import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './Note';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/notes', { withCredentials: true });
        setNotes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (noteText.trim() === '') return;
    try {
      const res = await axios.post(
        'http://localhost:5000/notes',
        { content: noteText },
        { withCredentials: true }
      );
      setNotes([...notes, res.data]);
      setNoteText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`, { withCredentials: true });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditNote = async (id, newContent) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/notes/${id}`,
        { content: newContent },
        { withCredentials: true }
      );
      setNotes(notes.map(note => (note.id === id ? res.data : note)));
      setIsEditing(false);
      setEditingNote(null);
      setNoteText('');  // Limpiar el input después de actualizar la nota
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setNoteText(note.content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingNote(null);
    setNoteText('');
  };

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      <div className="note-input">
        <textarea 
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note here..."
        ></textarea>
        <button onClick={isEditing ? () => handleEditNote(editingNote.id, noteText) : handleAddNote}>
          {isEditing ? 'Update Note' : 'Add Note'}
        </button>
        {isEditing && <button onClick={cancelEditing}>Cancel</button>}
      </div>
      <div className="notes-list">
        {notes.map(note => (
          <Note 
            key={note.id}
            note={note}
            onDelete={handleDeleteNote}
            onEdit={() => startEditing(note)}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;
