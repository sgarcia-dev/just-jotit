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
