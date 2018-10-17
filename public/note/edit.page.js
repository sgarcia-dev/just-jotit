let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const ETC = window.ETC_MODULE;

$(document).ready(onReady);

function onReady() {
    STATE.noteId = ETC.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getNoteById({
        noteId: STATE.noteId,
        onSuccess: RENDER.renderEditableNote
    });

    $('#note-edit-form').on('submit', onEditSubmit);
}

function onEditSubmit(event) {
    event.preventDefault();
    const newNote = {
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };

    HTTP.updateNote({
        noteId: STATE.noteId,
        newNote: newNote,
        jwtToken: STATE.authUser.jwtToken,
        onSuccess: note => {
            alert('Note changes saved succesfully, redirecting ...');
            window.open(`/note/details.html?id=${STATE.noteId}`, '_self');
        },
        onError: err => {
            alert('There was a problem editing this Note, please try again later.');
        }
    });
}
