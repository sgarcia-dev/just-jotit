let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onReady);

function onReady() {
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    $('#new-note-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
    event.preventDefault();
    const newNote ={
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };

    HTTP.createNote({
        jwtToken: STATE.authUser.jwtToken,
        newNote: newNote,
        onSuccess: note => {
            alert('Note created succesfully, redirecting ...');
            window.open(`/note/details.html?id=${note.id}`, '_self');
        },
        onError: err => {
            alert('Internal Server Error (see console)');
            console.error(err);
        }
    });
}
