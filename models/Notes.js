import mongoose from 'mongoose';

const NotesSchema = new Schema({
    title: {
        type: string,
        required: true
    },
    description: {
        type: string,
        required: true,
    },
    tag: {
        type: string,
        default: "general"
    },
    date: {
        type: Date,
        default: new Date
    }
});
module.exports = mongoose.model('notes', NotesSchema);