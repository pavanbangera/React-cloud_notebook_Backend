const express = require('express');
const { model, models } = require('mongoose');
const users = require('../models/User')
const router = express.Router()

router.post('/', (req, res) => {
    console.log(req.body)
    const user = users(req.body)
    user.save()
    res.send(req.body)
})
module.exports = router