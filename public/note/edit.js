let noteId, username, jwtToken;

$(document).ready(onReady);

function onReady() {
    checkAuthentication();
    $.getJSON('/api/note', getNoteDetails);
    $('#note-edit-form').on('submit', onEditSubmit);
}

function getNoteDetails(notes) {
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

    $.ajax({
        type: 'PUT',
        url: `/api/note/${noteId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newNote),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: note => {
            alert('Note changes saved succesfully, redirecting ...');
            window.open(`/note/details.html?id=${noteId}`, '_self');
        },
        error: err => {
            alert('Internal Server Error (see console)');
            console.error(err);
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

/**
 * Returns the value of a query string parameter. Credit:
 * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * @param {string} name
 * @returns {string} value
 * @example HTTP GET note/details.html?id=5b7b885bcaa2973d30aa2377
 * const id = getQueryStringParam('id'); // Returns 5b7b885bcaa2973d30aa2377
 */
function getQueryStringParam(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
