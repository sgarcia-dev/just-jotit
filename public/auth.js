$(document).ready(onReady);

function onReady() {
    $('#sign-up-form').submit(onSignUpSubmit);
    $('#login-form').submit(onLoginSubmit);
}

function onSignUpSubmit(event) {
    event.preventDefault();

    const userData = {
        name: $('#name-txt').val(),
        email: $('#email-txt').val(),
        username: $('#username-txt').val(),
        password: $('#password-txt').val()
    };
    
    ajax({
        method: 'POST',
        url: '/api/user',
        data: userData,
        callback: user => {
            alert(`User "${user.username}" created, you may now log in.`);
            window.open('/login.html', '_self');
        }
    });
}

function onLoginSubmit(event) {
    event.preventDefault();

    const userData = {
        username: $('#username-txt').val(),
        password: $('#password-txt').val()
    };
    
    ajax({
        method: 'POST',
        url: '/api/auth/login',
        data: userData,
        callback: response => {
            localStorage.setItem('jwtToken', response.jwtToken);
            localStorage.setItem('userid', response.user.id);
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('name', response.user.name);
            localStorage.setItem('email', response.user.email);
            alert('Login succesful, redirecting you to homepage ...');
            window.open('/', '_self');
        }
    });
}