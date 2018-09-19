let username, jwtToken;

$(document).ready(onReady);

function onReady() {
    checkLoginStatus();
    $('#new-post-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
    event.preventDefault();
    const newPost ={
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };
    
    // see public/utils.js
    ajax({
        method: 'POST',
        url: '/api/note',
        data: newPost,
        jwtToken: jwtToken,
        callback: post => {
            alert('Post created succesfully, redirecting ...');
            window.open(`/note/details.html?id=${post.id}`, '_self');
        }
    });
}

function checkLoginStatus() {
    jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        username = localStorage.getItem('username');
    } else {
        alert('You are not logged in, taking you back to home page.');
        window.open('/', '_self');
    }
}