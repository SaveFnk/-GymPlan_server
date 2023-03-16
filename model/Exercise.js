const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    IdUser:{
        type: Object,
        required: true
    },
    name: { 
        type: String,
        required: true
    },
    description: String
}, {
    strict: false
  });

module.exports = mongoose.model('Exercise', exerciseSchema);