// sigle exercise controller class
const Exercise = require('../model/Exercise');

const createNewExercise = async (req, res) => {
    if (!req?.body?.data?.IdUser || !req?.body?.data?.name ) {
        return res.status(400).json({ 'message': 'ID User and name are required' });
    }
    try {
        const result = await Exercise.create(req.body.data);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateExercise = async (req, res) => {
    console.log("update EXERCISE");
    console.log(req?.body.data);
    if (!req?.body?.data.IdUser || !req?.body?.data._id) {
        return res.status(400).json({ 'message': 'ID User and parameter is required.' });
    }

    const exercise = await Exercise.findOne({ 
        IdUser: req.body.data.IdUser, 
        _id: req.body.data._id }).exec();

    if (!exercise) {//maybe create one (?)
        var result;
        console.log("create ex");
        try {//create new exercise
            result = await Exercise.create(req.body.data);
        } catch (err) {
            console.error(err);
            return res.status(403).json({ "message": `error during creation `});
        }
        return res.status(201).json({ "message": `created new exercise`,result});
    }else{
        if (req.body?.data.name) exercise.name = req.body.data.name;
        //TODO HOW TO UPDATE FILD THAT ARE DINAICALLY ADDED ?????
        
        var result = await exercise.save();
        res.json(result);
    }
    
}

const deleteExercise = async (req, res) => {
    if (!req?.body?.data?.IdUser || !req?.query?.data?._id) return res.status(400).json({ 'message': 'ID User and ID are required.' });

    const exercise = await Exercise.findOne({ IdUser: req?.body?.data?.IdUser, _id: req?.body?.data?._id }).exec();
    
    if (!exercise) {
        return res.status(204).json({ "message": `No workout matches ID User or ID: ${req?.body?.data?.IdUser} or ${req?.body?.data?._id}.` });
    }
    const result = await exercise.deleteOne(); 
    res.json(result);
}

//only get the data
const getAllExercise = async (req, res) => {
    if (!req?.params?.IdUser) return res.status(400).json({ 'message': 'User ID required.' });

    const exercise = await Exercise.find({ IdUser: req.params.IdUser}).exec();
    if (!exercise) {
        return res.status(204).json({ "message": `No workout matches ID User: ${req.params.IdUser}` });
    }
    exercise.sort((a, b) => a.name.localeCompare(b.name));
    res.json(exercise);
}

module.exports = {
    createNewExercise,
    updateExercise,
    deleteExercise,
    getAllExercise
}