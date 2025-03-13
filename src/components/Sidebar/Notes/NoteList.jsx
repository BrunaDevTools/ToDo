export default function NoteList({
  notes,
  selectedNote,
  onNoteClick,
  className,
}) {
  return (
    <div className={className}>
      <h3>Notas</h3>
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            onClick={() => onNoteClick(note)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedNote?.id === note.id ? "#e0e0e0" : "transparent",
              borderLeft:
                selectedNote?.id === note.id ? "4px solid #01b0c4" : "none",
            }}
          >
            <span style={{ marginLeft: "10px" }}>{note.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
