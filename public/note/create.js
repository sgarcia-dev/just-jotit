let username, jwtToken;

$(document).ready(onReady);

function onReady() {
    checkAuthentication();
    $('#new-note-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
    event.preventDefault();
    const newNote ={
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };
    
    // see public/utils.js
    ajax({
        method: 'POST',
        url: '/api/note',
        data: newNote,
        jwtToken: jwtToken,
        callback: note => {
            alert('Note created succesfully, redirecting ...');
            window.open(`/note/details.html?id=${note.id}`, '_self');
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