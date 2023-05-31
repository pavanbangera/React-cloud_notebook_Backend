const mongoose = require('mongoose');

const mongooseConnect = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/notebook').then(() => {
        console.log("connected")
    }).
        catch(error => handleError(error));
}

module.exports = mongooseConnect;