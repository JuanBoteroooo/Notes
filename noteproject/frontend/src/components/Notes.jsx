import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './Note';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

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
      setNoteText('');
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

  const openModal = (note) => {
    setSelectedNote(note);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNote(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="notes-container">
      <h2>Notas</h2>
      <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
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
          <div key={note.id}>
            <Note 
              note={note}
              onDelete={handleDeleteNote}
              onEdit={() => startEditing(note)}
              onDoubleClick={() => openModal(note)}
            />
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Note Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedNote && (
          <div>
            <h2>Nota</h2>
            <p className="note-content">{selectedNote.content}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Notes;
