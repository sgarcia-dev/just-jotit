window.CACHE_MODULE = {
    getAuthenticatedUserFromCache,
    saveAuthenticatedUserIntoCache,
    deleteAuthenticatedUserFromCache
};

function getAuthenticatedUserFromCache() {
    const jwtToken = localStorage.getItem('jwtToken');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    if (jwtToken) {
        return {
            jwtToken,
            userid,
            username,
            name,
            email
        };
    } else {
        return undefined;
    }
}

function saveAuthenticatedUserIntoCache(user) {
    localStorage.setItem('jwtToken', user.jwtToken);
    localStorage.setItem('userid', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
}

function deleteAuthenticatedUserFromCache() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
}