const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

//checks for last theme in browser storage
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

//enables toggle between dark and light themes 
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    }
};

toggleSwitch.addEventListener('change', switchTheme);

/* =======================
    get and display notes
======================== */
const body = document.querySelector('body');
const main = document.querySelector('main');
const editModal = document.querySelector('.modal');
const textarea = document.querySelector('textarea');
const editNote = document.querySelector('.edit-button');
const deleteNote = document.querySelector('.delete-button');
const exitModal = document.querySelector('.exit-modal-button');
const editDate = document.querySelector('.time-edited');
// const exitModalConfirm = document.querySelector('.exit-modal-confirmation');

const list = document.createElement('ul');
const notesNumber = document.createElement('p');
const deleteAllButton = document.createElement('button');
deleteAllButton.className = 'delete-all-notes';
deleteAllButton.textContent = 'Delete all notes';
list.className = 'notes-list';
notesNumber.className = 'note-number';
body.appendChild(notesNumber);
body.appendChild(list);

let notesList = JSON.parse(localStorage['notes']);
notesNumber.innerHTML = `Number of saved notes: ${notesList.length}`;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getNote() {
    if (localStorage.length > 1) {
        body.removeChild(main);
        body.appendChild(deleteAllButton);

        //displays notes
        for (let i = 0; i <= notesList.length; i++) {
            let note = document.createElement('li');
            note.textContent = notesList[i].text;
            note.className = 'new-note';
            list.appendChild(note);

            //displays area for editing note
            note.addEventListener('click', function() {
                editModal.style.display = 'block';
                textarea.value = note.textContent;
                textarea.id = notesList[i].id;
                editDate.textContent = notesList[i].date;
            })
        }
    }
}

window.onload = getNote;

//to delete all notes

deleteAllButton.addEventListener('click', function() {
    let confirmation = window.confirm(`Are you sure you want to delete all notes? Click "Ok" to continue or "Cancel" to abort this operation`);
    if (confirmation === true) {
        localStorage.removeItem('notes');
        location.reload();
    }
})

//to delete a specific note

deleteNote.addEventListener('click', function() {
    let confirmation = window.confirm(`Are you sure you want to delete this note? Click "Ok" to continue or "Cancel" to abort this operation`);
    if (confirmation === true) {
        notesList = notesList.filter(currentnote => {
            return !(currentnote.id == textarea.id);
        });
        localStorage['notes'] = JSON.stringify(notesList);
        if (notesList == false) {
            localStorage.removeItem('notes');
        }
        location.reload();
    }
});

//to edit and save changes to a note

editNote.addEventListener('click', function() {
    notesList = notesList.map(currentnote => {
        if (currentnote.id == textarea.id) {
            let noteDate = new Date;
            return {
                id: currentnote.id,
                text: textarea.value,
                date: `Last edited at ${noteDate.toLocaleTimeString()} on ${days[noteDate.getDay()]}, ${noteDate.getDate()} ${months[noteDate.getMonth()]} ${noteDate.getFullYear()}`
            };
        } else {
            return currentnote;
        }
    })
    localStorage['notes'] = JSON.stringify(notesList);
    location.reload();
})

exitModal.addEventListener('click', function() {
    let confirmation = window.confirm('Are you sure you want to exit? Any changes made to this note will not be saved');
    if (confirmation === true) {
        editModal.style.display = 'none';
    } else {
        editModal.style.display = 'block';
    }
})