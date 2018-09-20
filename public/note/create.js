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

    $.ajax({
        type: 'POST',
        url: '/api/note',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newNote),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: note => {
            alert('Note created succesfully, redirecting ...');
            window.open(`/note/details.html?id=${note.id}`, '_self');
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