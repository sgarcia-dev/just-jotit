let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onPageLoad);

function onPageLoad() {
    updateAuthenticatedUI();
    
    if (STATE.authUser) {
        HTTP.getUserNotes({
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: RENDER.renderNotesList
        });
    } 
    
    $('#logout-btn').on('click', onLogoutBtnClick);
    $('#note-list').on('click', '#delete-note-btn', onDeleteNoteBtnClick);
    $('#note-list').on('click', '#note-card', onNoteCardClick);
}

function onLogoutBtnClick(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        CACHE.deleteAuthenticatedUserFromCache();
        window.open('/auth/login.html', '_self');
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
        HTTP.deleteNote({
            noteId: noteId,
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: () => {
                // Step 4: If succesful, reload the notes list
                alert('Note deleted succesfully, reloading results ...');
                HTTP.getUserNotes({
                    jwtToken: STATE.authUser.jwtToken,
                    onSuccess: RENDER.renderNotesList
                });
            }
        });
    }
}

function updateAuthenticatedUI() {
    const authUser = CACHE.getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
        $('#nav-greeting').html(`Welcome, ${authUser.name}`);
        $('#auth-menu').removeAttr('hidden');
    } else {
        $('#default-menu').removeAttr('hidden');
    }
}
