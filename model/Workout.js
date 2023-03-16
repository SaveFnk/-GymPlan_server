const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    IdUser: Object,
    name: {
        type: String,
        required: true
    },
    sch: Object,
    histId: Object
});

module.exports = mongoose.model('Workout', workoutSchema);