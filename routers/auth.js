const express = require('express');
const { model, models } = require('mongoose');
const users = require('../models/User')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchUserData = require('../midleware/fetchUserData')


//router 1 used to create user
router.post('/createUser', [
    body('name', "Please enter Name").isLength({ min: 5 }),
    body('password', "Password length should be >=5").isLength({ min: 6 }),
    body('email', "Please enter valid email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    //validator for chekking information
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //checking email alredy exist or not
    try {
        let user = await users.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).send({ error: "User already exist" })
        }
        //password hass
        const salt = bcrypt.genSaltSync(10);
        const passHash = bcrypt.hashSync(req.body.password, salt)

        //stored at user collection
        await users.create({
            name: req.body.name,
            email: req.body.email,
            password: passHash
        })

        //create private token for authentication...hereb 'notebook is secrete sign
        const data = {
            user: {
                id: users.id
            }
        }
        var authToken = jwt.sign(data, 'notebook');
        res.send({ authToken })
    }

    catch {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

//router 2 used to user login

router.post("/loginUser", [
    body('password', "Password length should be >=5").isLength({ min: 6 }),
    body('email', "Please enter valid email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Incorrect credentials" })
        }
        const passCompare = bcrypt.compareSync(password, user.password)
        if (!passCompare) {
            return res.status(400).send({ error: "Incorrect credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        var authToken = jwt.sign(data, 'notebook');
        res.send({ authToken })
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

//router 3. this route used get user authentication
router.post('/getUser', fetchUserData, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.user.id)
        const user = await users.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})
module.exports = router