const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const express = require('express');
const app = express();

// express.static serves, images, CSS, and JS files (in the public folder)
app.use(express.static('public'));

// express.json expects data to be sent in json format
app.use(express.json());

// express.urlencoded expects data to be sent encoded in the URL
app.use(express.urlencoded({extended:true}));

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));    
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// This function is for adding a note. It puts the title and the body of the note into the db.json

function addNote (body, nArray) {
    const note = body;
    if (!Array.isArray(nArray))
    nArray = [];

    if (nArray.length === 0)
    nArray.push(0);

    body.id = nArray[0];
    nArray[0]++;

    nArray.push(note);
    fs.writeFileSync(path.join(__dirname, './db/db.json'),
    JSON.stringify(nArray, null, 2)
);
return note;
};

// This posts the note to the left side of the screen.
app.post('/api/notes', (req, res) => {
    const note = addNote (req.body, notes);
    res.json(note);
});

function deleteNote (id, nArray) {
    for (let i = 0; i < nArray.length; i++) {
        let selectedNote = nArray[i];

        if (selectedNote.id == id) {
            nArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'),
            JSON.stringify(nArray, null, 2)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote (req.params.id, notes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`The Note Taker app is listening at http://localhost:${PORT}`)
});