const History = require('../model/History');

const createNewHistory = async (req, res) => {
    if (!req?.body?.IdUser || !req?.body?.sch || !req?.body?.date) {
        return res.status(400).json({ 'message': 'ID User and split are required' });
    }
    try {
        const result = await History.create({
            IdUser: req.body.IdUser,
            sch: req.body.sch,
            date: req.body.date
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

///////////////////////
const updateHistory = async (req, res) => {
    console.log(req?.body.data);
    if (!req?.body?.data.IdUser || !req?.body?.data.date) {
        return res.status(400).json({ 'message': 'ID User parameter and date are required.' });
    }
    const history = await History.findOne({ IdUser: req.body.data.IdUser, date: req.body.data.date  }).exec();
    if (!history) {
        try {//create new split
            const result = await History.create({
                IdUser: req.body.data.IdUser,
                sch: req.body.data.sch,
                date: req.body.data.date
            });
        } catch (err) {
            console.error(err);
            return res.status(403).json({ "message": `error during creation `});
        }
        return res.status(201).json({ "message": `created new history`});
    }
    if (req.body?.data.sch) history.sch = req.body.data.sch;
    const result = await history.save();
    res.json(result);
}

const deleteHistory = async (req, res) => {
    if (!req?.body?.IdUser || !req?.body?.date) return res.status(400).json({ 'message': 'User ID and date are required.' });

    const history = await History.findOne({ IdUser: req.body.IdUser }).exec();
    if (!history) {
        return res.status(204).json({ "message": `No User matches ID ${req.body.IdUser}.` });
    }
    const result = await history.deleteOne({ date: req.body.date }); //{ _id: req.body.id }
    res.json(result);
}

const getHistoryOf = async (req, res) => {
    if (!req?.query?.IdUser) return res.status(400).json({ 'message': 'ID User required.' });

    const history = await History.findOne({ IdUser: req.query.IdUser }).exec();
    if (!history) {
        return res.status(204).json({ "message": `No history matches ID User: ${req.query.IdUser}.` });
    }
    res.json(history);
}

module.exports = {
    createNewHistory,
    updateHistory,
    deleteHistory,
    getHistoryOf
}