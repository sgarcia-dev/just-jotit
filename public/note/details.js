let noteId, username, jwtToken;

$(document).ready(onReady);

function onReady() {
    noteId = getQueryStringParam('id');
    checkAuthentication();
    $('#note-details').on('click', '#edit-note-btn', onEditNoteBtnClick);
    $.getJSON(`/api/note/${noteId}`, renderNote);
}

function renderNote(note) {
    let editButton = '';
    if (note.author === username) {
        editButton = '<br><button id="edit-note-btn">Edit Note</button>';
    }
    $('#note-details').html(`
		${editButton}
		<h1>${note.title}</h1>
		<i>${note.user.name} | ${new Date(note.updateDate).toLocaleString()}</i>
		<p>${note.content}</p>
	`);
}

function onEditNoteBtnClick(event) {
    event.preventDefault();
    window.open(`/note/edit.html?id=${noteId}`, '_self');
}

function checkAuthentication() {
    jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        username = localStorage.getItem('username');
    }
}