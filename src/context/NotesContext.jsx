import { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  // Cargar notas desde localStorage al iniciar
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState(null);

  // Guardar notas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Función para agregar una nueva nota
  const addNote = (noteTitle) => {
    if (!noteTitle) return;
    const newId =
      notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    const newNote = {
      id: newId,
      title: noteTitle,
      content: "",
      dateCreated: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote); // Selecciona la nota recién creada
  };

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote, addNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
