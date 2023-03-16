// sigle workout controller class
const Workout = require('../model/Workout');

//TODO ALL CLASS 
//TODO ALL CLASS   
//TODO ALL CLASS

//create new Workout (histId empty) and then add it to the user splits
/*
const createNewWorkout = async (req, res) => {
    if (!req?.body?.data.IdUser || !req?.body?.data.name || !req?.body?.data.sch ) {
        return res.status(400).json({ 'message': 'ID User, name, sch are required' });
    }
    try {
        const result = await Workout.create({
            IdUser: req.body.data.IdUser,
            name: req.body.data.name,
            sch: req.body.data.sch,
            histId: []
        });
        console.log("reuslt create new ");
        console.log(result);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}*/

///////if ther'isn't Workout that match create one.
//     if exist change name if present, change sch or add id of history in to array
    

// SONO UN COGLIONO SOLO NELLA RICHIESTA CI DEVONO ESSERE PIÙ ID
/*
const updateWorkout = async (req, res) => {
    console.log("update provaaaa");
    console.log(req?.body.data);
    if (!req?.body?.data.IdUser || !req?.body?.data.ID) {
        return res.status(400).json({ 'message': 'ID User and parameter is required.' });
    }
    var IDs=[];
    for(let i=0;i<req.body.data.ID.length;i++){
        IDs[i]=mongoose.Types.ObjectId(req.body.data.ID[i]);
    }

    const workout = await Workout.find({ 
        IdUser: req.body.data.IdUser, 
        _id: { $in: IDs} }).exec();
    if (!workout) {//maybe create one (?)
        var result;
        var hist = req.body.data.histId?[req.body.data.histId]:[];
        console.log("update prova");
        try {//create new split
            result = await Workout.create({
                IdUser: req.body.data.IdUser,
                name: req.body.data.name,
                sch: req.body.data.sch,
                histId: hist
            });
        } catch (err) {
            console.error(err);
            return res.status(403).json({ "message": `error during creation `});
        }
        return res.status(201).json({ "message": `created new splits`,result});
    }
    if (req.body?.data.name) Workout.name = req.body.data.name;
    if (req.body?.data.sch) Workout.sch = req.body.data.sch;
    if (req.body?.data.histId) Workout.histId.push(req.body.data.histId);
    
    var result = await workout.save();
    res.json(result);
}*/

//delete and do nothing
/*
const deleteWorkout = async (req, res) => {
    if (!req?.body?.data?.IdUser || !req?.query?.data?.ID) return res.status(400).json({ 'message': 'ID User and ID are required.' });

    const workout = await Workout.findOne({ IdUser: req?.body?.data?.IdUser, _id: req?.body?.data?.ID }).exec();
    if (!workout) {
        return res.status(204).json({ "message": `No workout matches ID User or ID: ${req?.body?.data?.IdUser} or ${req?.body?.data?.ID}.` });
    }
    const result = await workout.deleteOne(); 
    res.json(result);
}*/

//only get the data
const getAllWorkouts = async (req, res) => {
    if (!req?.params?.IdUser) return res.status(400).json({ 'message': 'User ID required.' });

    const workouts = await Workout.find({ IdUser: req.params.IdUser}).exec();
    if (!workouts) {
        return res.status(204).json({ "message": `No workout matches ID User: ${req.params.IdUser}` });
    }
    res.json(workouts);
}

module.exports = {
    //getAllSplits,
    //createNewWorkout,
    //updateWorkout,
    //deleteWorkout,
    getAllWorkouts
}