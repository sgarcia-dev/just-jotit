const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onPageLoad);

function onPageLoad() {
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

    HTTP.signupUser({
        userData,
        onSuccess: user => {
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

    HTTP.loginUser({
        userData,
        onSuccess: response => {
            const authenticatedUser = response.user;
            authenticatedUser.jwtToken = response.jwtToken;
            CACHE.saveAuthenticatedUserIntoCache(authenticatedUser);
            alert('Login succesful, redirecting you to homepage ...');
            window.open('/', '_self');
        }
    });
}