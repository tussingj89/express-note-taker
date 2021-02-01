//imports
const express = require("express");
const path = require("path");
const fs = require("fs"); 

// sets up the port and the express App
const app = express();
let PORT = process.env.PORT || 3001;

//set up for the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// when the url ends with / it takes you to index.html
app.get("/", function(req, res) {
    res.json(path.join(__dirname, "public/index.html"));
  });

//when url ends with a /notes it takes you to the note.html page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// brings up the api information it retrived from the db.json file
app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
      res.json(JSON.parse(data));
    });
});
 //post the not to the db.json file and assigns the note an id number
app.post('/api/notes', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})
// deletes the note form the db.jason file by the id number 
app.delete('/api/notes/:id',(req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})
// wildcard to return to index.html page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//starts the localhost
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
