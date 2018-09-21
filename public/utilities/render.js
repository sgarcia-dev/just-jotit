window.RENDER_MODULE = {
    renderNotesList,
    renderNoteDetails,
    renderEditableNote
};

function renderNotesList(notes) {
    const notesHtml = notes.map(noteToHtml).join('<hr/>');
    $('#note-list').html(notesHtml);

    function noteToHtml(note) {
        let noteSummary = note.content;
        if (noteSummary.length > 120) {
            noteSummary = `${note.content.substring(0, 120)}...`;
        }
        return `
        <div id="note-card" data-note-id="${note.id}">
            <h3 class="card-header">${note.title}
            <button id="delete-note-btn">Delete</button></h3>
            <p class="card-content">${noteSummary}</p>
            <p class="card-info">
                <i>${note.user.name} | Last update on ${new Date(note.updateDate).toLocaleDateString()}</i>
            </p>
        </div>
        `;
    }
}

function renderNoteDetails(note) {
    $('#note-details').html(`
        <br/>
        <button id="edit-note-btn">Edit Note</button>
		<h1>${note.title}</h1>
		<i>${note.user.name} | ${new Date(note.updateDate).toLocaleString()}</i>
		<p>${note.content}</p>
	`);
}

function renderEditableNote(note) {
    $('#title-txt').prop('disabled', false).val(note.title);
    $('#content-txt').prop('disabled', false).val(note.content);
}