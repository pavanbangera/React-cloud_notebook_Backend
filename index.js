const mongooseConnect = require('./db')
const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config();
const port = process.env.APP_PORT
mongooseConnect();


app.use(cors())

app.use(express.json())
app.use('/api/auth', require('./routers/auth'))
app.use('/api/notes', require('./routers/notes'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
