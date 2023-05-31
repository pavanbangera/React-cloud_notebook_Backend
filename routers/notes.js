const express = require('express');
const { model, models } = require('mongoose');
const router = express.Router()

router.get('/', (req, res) => {
    obj = {
        title: "kumar",
        desc: "ghdghsghdgshjd"
    }
    res.json(obj)
})
module.exports = router