$(document).ready(onReady);

let STATE = {
    isLoggedIn: false
};

function onReady() {
    updateAuthenticatedUI();
    
    if (STATE.isLoggedIn) {
        fetchUserNotes();
    } 
    
    $('#logout-btn').on('click', onLogoutBtnClick);
    $('#note-list').on('click', '#delete-note-btn', onDeleteNoteBtnClick);
    $('#note-list').on('click', '#note-card', onNoteCardClick);
}

function fetchUserNotes() {
    $.ajax({
        type: 'GET',
        url: '/api/note',
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${STATE.jwtToken}`);
        },
        success: renderNotes,
        error: err => {
            alert('Internal Server Error.');
            console.error(err);
        }
    });
}

function renderNotes(notes) {
    $('#note-list').html(notes.map(noteToHtml).join('<hr/>'));
}

function noteToHtml(note) {
    let deleteButton = '';
    if (note.user.username === STATE.username) {
        deleteButton = '<button id="delete-note-btn">Delete</button>';
    }
    return `
    <div id="note-card" data-note-id="${note.id}">
        <h3 class="card-header">${note.title} ${deleteButton}</h3>
        <p class="card-content">${note.content.substring(0, 30)}</p>
        <p class="card-info">
            <i>${note.user.name} | Last update on ${new Date(note.updateDate).toLocaleDateString()}</i>
        </p>
	</div>
    `;
}

function onLogoutBtnClick(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userid');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        window.open('/login.html', '_self');
    }
}

// Handle opening note details
function onNoteCardClick(event) {
    const noteId = $(event.currentTarget).attr('data-note-id');
    window.open(`note/details.html?id=${noteId}`, '_self');
}

// Handle deleting notes
function onDeleteNoteBtnClick(event) {
    /**
	 * Because "onNoteDeleteClick" and "onNoteClick" both are listening for clicks inside of
	 * #note-card element, we need to call event.stopImmediatePropagation to avoid both
	 * event listeners firing when we click on the delete button inside #note-card.
	 */
    event.stopImmediatePropagation(); 
    // Step 1: Get the note id to delete from it's parent.
    const noteId = $(event.currentTarget)
        .closest('#note-card')
        .attr('data-note-id');
    // Step 2: Verify use is sure of deletion
    const userSaidYes = confirm('Are you sure you want to delete this note?');
    if (userSaidYes) {
        // Step 3: Make ajax call to delete note
        ajax({
            method: 'delete',
            url: `/api/note/${noteId}`,
            callback: () => {
                // Step 4: If succesful, reload the notes list
                alert('Note deleted succesfully, reloading results ...');
                $.getJSON('api/note', renderNotes);
            }
        });
    }
}

function updateAuthenticatedUI() {
    if (checkUserAuthentication()) {
        $('#nav-greeting').html(`Welcome, ${STATE.name}`);
        $('#auth-menu').removeAttr('hidden');
    } else {
        $('#default-menu').removeAttr('hidden');
    }
}

function checkUserAuthentication() {
    STATE.jwtToken = localStorage.getItem('jwtToken');
    if (STATE.jwtToken) {
        STATE.isLoggedIn = true;
        STATE.userid = localStorage.getItem('userid');
        STATE.username = localStorage.getItem('username');
        STATE.name = localStorage.getItem('name');
        STATE.email = localStorage.getItem('email');
        return true;
    } else {
        return false;
    }
}