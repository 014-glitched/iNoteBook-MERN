const express = require('express')
//The express.Router() function is used to create a new router object. This function is used when you want to create a new router object in your program to handle requests. 
const router = express.Router()
const fetchUser = require('../middleware/fetchUser');
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get all the notes of the logged in user using: GET "/api/notes/fetchallnotes": Login required
router.get('/fetchallnotes',fetchUser, async (req, res) => {    
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
        } 
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
})

//ROUTE 2: Add a new note using: POST "/api/notes/addnote" : Login required
router.post('/addnote', fetchUser, [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
] , async (req, res) => {   
    
    try {
        const{title, description, tag} = req.body;

        //if there are error, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();

        res.json(savedNote);
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote": Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => { 
    try {
        
    const {title, description, tag} = req.body;

    //Create a newNote object
    const newNote = {};
    if(title){newNote.title = title}; //if title is coming as part of the request then we will update the newNote object with the new title.
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the note to update and update it
    let note = await Note.findById(req.params.id); // refers to the value of a parameter with the name "id"
    if(!note){return res.status(404).send("Not found")};

    if(note.user.toString() !== req.user.id ){  //note.user.toString() give the id of the note
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true}) //The purposes of $set, is to ensure we don't have conflicting updates occurring at the same time.
    res.json(note); 
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote": Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {   
    try {

    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")};

    //Allow deletion if user owns this Note
    if(note.user.toString() !== req.user.id ){  
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note: note}); 
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router