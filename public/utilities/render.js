window.RENDER_MODULE = {
    renderNotesList
};

function renderNotesList(notes) {
    const notesHtml = notes.map(noteToHtml).join('<hr/>');
    $('#note-list').html(notesHtml);

    function noteToHtml(note) {
        return `
        <div id="note-card" data-note-id="${note.id}">
            <h3 class="card-header">${note.title}
            <button id="delete-note-btn">Delete</button></h3>
            <p class="card-content">${note.content.substring(0, 30)}</p>
            <p class="card-info">
                <i>${note.user.name} | Last update on ${new Date(note.updateDate).toLocaleDateString()}</i>
            </p>
        </div>
        `;
    }
}