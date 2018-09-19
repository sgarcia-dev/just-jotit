let noteId, username, jwtToken;

$(document).ready(onReady);

function onReady() {
    checkAuthentication();
    $.getJSON('/api/note', getNoteDetails);
    $('#note-edit-form').on('submit', onEditSubmit);
}

function getNoteDetails(notes) {
    // see public/utils.js
    noteId = getQueryStringParam('id');
    const noteToRender = notes.find(note => note.id == noteId);
    if (noteToRender.author === username) {
        renderNote(noteToRender);
    } else {
        alert('You are not the owner of this note, redirecting to homepage ...');
        window.open('/', '_self');
    }
}

function renderNote(note) {
    // Populate form fields with note data
    $('#author-txt').prop('disabled', false).val(note.author);
    $('#title-txt').prop('disabled', false).val(note.title);
    $('#content-txt').prop('disabled', false).val(note.content);
}

function onEditSubmit(event) {
    event.preventDefault();
    const newNote ={
        author: $('#author-txt').val(),
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };
    
    // see public/utils.js
    ajax({
        method: 'PUT',
        url: `/api/note/${noteId}`,
        data: newNote,
        jwtToken: jwtToken,
        callback: note => {
            alert('Note changes saved succesfully, redirecting ...');
            window.open(`/note/details.html?id=${noteId}`, '_self');
        }
    });
}

function checkAuthentication() {
    jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        username = localStorage.getItem('username');
    } else {
        alert('You are not logged in, taking you back to home page.');
        window.open('/', '_self');
    }
}