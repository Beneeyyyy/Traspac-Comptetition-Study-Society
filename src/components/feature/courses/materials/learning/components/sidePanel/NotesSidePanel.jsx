import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';

const NotesSidePanel = ({ show, onClose, materialId }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(`notes-${materialId}`);
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem(`notes-${materialId}`, JSON.stringify(notes));
  }, [notes, materialId]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote.trim(),
          timestamp: new Date().toISOString()
        }
      ]);
      setNewNote('');
    }
  };

  const handleEditNote = (id) => {
    const note = notes.find(n => n.id === id);
    setEditingId(id);
    setEditText(note.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      setNotes(notes.map(note => 
        note.id === id 
          ? { ...note, text: editText.trim() }
          : note
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-80 bg-[#0A0A0B] border-l border-white/[0.05] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
          <h2 className="text-lg font-semibold">Catatan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Add Note Form */}
        <div className="p-4 border-b border-white/[0.05]">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg p-2 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-white/10 resize-none"
            placeholder="Tulis catatan baru..."
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-50 disabled:hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.map(note => (
            <div
              key={note.id}
              className="group bg-white/[0.02] border border-white/[0.05] rounded-lg p-3"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-black/20 text-white rounded-lg p-2 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-white/10 resize-none"
                    placeholder="Tulis catatan..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-sm hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveEdit(note.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
                    >
                      <FiSave className="w-4 h-4" />
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/80 text-sm">{note.text}</p>
                  <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors text-red-400"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotesSidePanel; 