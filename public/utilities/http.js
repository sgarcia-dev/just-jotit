window.HTTP_MODULE = {
    signupUser,
    loginUser,
    getUserNotes,
    deleteNote
};

function signupUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/user',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function loginUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function getUserNotes(options) {
    const { jwtToken, onSuccess, onError } = options;
    $.ajax({
        type: 'GET',
        url: '/api/note',
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function deleteNote(options) {
    const { noteId, jwtToken, onSuccess, onError } = options;
    $.ajax({
        type: 'delete',
        url: `/api/note/${noteId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}