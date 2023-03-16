const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    IdUser: Object,
    date: Object,
    sch: Object
});

module.exports = mongoose.model('History', HistorySchema);