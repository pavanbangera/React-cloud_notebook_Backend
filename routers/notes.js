const express = require('express');
const { model, models } = require('mongoose');
const note = require('../models/Note')
const fetchUserData = require('../midleware/fetchUserData')
const { body, validationResult } = require('express-validator');
const router = express.Router()

router.post('/addnote', fetchUserData, [
    body('title', "Please enter title").isLength({ min: 3 }),
    body('description', "Please enter description").isLength({ min: 3 }),],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body
            console.log(title)
            const errors = validationResult(req);
            //validator for chekking information
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            await note.create({
                title: title,
                description: description,
                tag: tag,
                user: req.user.id
            })

            res.json({ note })
        } catch (error) {
            res.json("Internal server error")
        }

    })

router.get('/fetchnotes', fetchUserData, async (req, res) => {
    const id = req.user.id;
    try {
        const notes = await note.find({ user: id })
        res.send({ notes })
    } catch (error) {
        res.json("Internal server error")
    }
})


router.put('/updatenote/:id', fetchUserData, async (req, res) => {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    // Find the note to be updated and update it
    try {
        let Note = await note.findById(req.params.id);
        if (!Note) { return res.status(404).send("Not Found") }

        if (Note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        Note = await note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ Note });

    } catch (error) {
        res.json("Internal server error")
    }
})


router.delete('/deletenote/:id', fetchUserData, async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Note = await note.findById(req.params.id);
        if (!Note) { return res.status(404).send("Not Found") }

        if (Note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        Note = await note.findByIdAndDelete(req.params.id)
        res.json({ Note });

    } catch (error) {
        res.json("Internal server error")
    }
})

module.exports = router