const Splits = require('../model/Splits');
const Workout = require('../model/Workout');

const mongoose = require('mongoose');

//DA RIVEDERE PER LA PRIVACY
/*
const getAllSplits = async (req, res) => {
    const employees = await Splits.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}*/

/*create new split:
- add the new workouts to the user workouts
when they are created:
- add theyr ID to the user splits
 */
/*
const createNewSplits = async (req, res) => {
    if (!req?.body?.IdUser || !req?.body?.scs) {
        return res.status(400).json({ 'message': 'ID User and split are required' });
    }

    try {
        const result = await Splits.create({
            IdUser: req.body.IdUser,
            scs: req.body.scs
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}*/
//return the id of the workout
async function updateWorkout(workout){
    console.log("UW: update Workout");
    console.log(workout);//from the client

    //check error of ID:
    if(workout._id === ""){
        console.log("UW: ID empty");
        workout._id = "000000000000000000000000";
    }

    const WO = await Workout.findOne({ 
        IdUser: workout.IdUser, 
        _id: workout._id })
    .then(woFound => {
        console.log("UW: Find result:");
        console.log(woFound);
        return woFound;
    }).catch(err => {
        console.error(err);
        console.log("UW: error during updating of the workout");
        return [];
    });

    if (!WO) {//maybe create one (?) 
        var hist = [];   
        if (workout.histId){
            console.log("UW: create a copy of history");
            //TODO
        }
        
        console.log("UW: create new workout");
        var id = await Workout.create({
            IdUser: workout.IdUser,
            name: workout.name,
            sch: workout.sch,
            histId: hist
        }).then(result => {
            console.log("UW: result:");
            console.log(result);
            return result._id;
        }).catch(err => {
            console.error(err);
            console.log("UW: error during creation of the workout");
            return "";
        });
        return id;
    }//else update
    console.log("UW: existing workout, update it");
    if (workout.name) WO.name = workout.name;
    if (workout.sch) WO.sch = workout.sch;
    //TODO: update history
    if (workout.histId){
        console.log("UW: update history");
        //WO.histId.push(workout.histId);
    } 

    var ris = await WO.save().then(res => {
        console.log("UW: result:");
        console.log(res);
        return res._id;
    }).catch(err => {
        console.error(err);
        console.log("UW: error during creation of the workout");
        return "";
    });
    console.log("UW: ris:");
    console.log(ris);
    return ris;

}

///////////////////////
const updateSplits = async (req, res) => {
    console.log(">>> data:")
    console.log(req?.body.data);
    if (!req?.body?.data?.IdUser) {
        return res.status(400).json({ 'message': 'ID User parameter is required.' });
    }
    if (!req.body?.data.scs){//this SCS is only one of the splits
        return res.status(400).json({ 'message': 'SCS requested.' });
    }
    if(!req.body.data.scs.name){
        return res.status(400).json({ 'message': 'NAME is required.' });
    } 
    if(!req.body.data.scs.hasOwnProperty('current')){
        return res.status(400).json({ 'message': 'CURRENT is required.' });
    }
    if(!req.body.data.scs.works){
        return res.status(400).json({ 'message': 'WORKS is required.' });
    }
    console.log(">>> data ok");

    //const splits = await Splits.findOne({ IdUser: req.body.data.IdUser }).exec();

    //update workouts
    const promises = [];
    
    (req.body.data.scs.works).forEach(function(workout) {
        console.log(">>> workout:");
        var id_wo = updateWorkout(workout)
        .then( ID =>{
            console.log(">>> ID after update:");
            console.log(ID);
            return ID.toString();
        
        });//TODO da rifare

        if(!id_wo){
            return res.status(400).json({ 'message': 'WORKOUT error.' });
        }
        promises.push(id_wo);//add id to workouts array
    });
    console.log(">>> promises:");
    console.log(promises);
    ResultWorks = await Promise.all(promises);

    console.log(">>> ResultWorks:");
    console.log(ResultWorks);

    var scs = req.body.data.scs;
    console.log(">>> Find Split:");
    //find the split
    const split = await Splits.findOne({ IdUser: req.body.data.IdUser })
    .then(splits => {
        console.log(">>> splits:");
        console.log(splits);
        return splits;

    }).catch(err => {
        console.error(err);
        return res.status(400).json({ 'message': 'Find split error.' });
    });

    if(split){//exist
        console.log(">>> splits exist");
        var update = false
        
        var newSCS = split.scs;

        if(scs.ID.toString() !== ""){//update
            console.log("update, old splits:");
            console.log(split.scs);

            split.scs.forEach(function(sp,index) {
                if(sp.ID.toString() === scs.ID){
                    console.log(">>> founded");
                    //update
                    newSCS[index].name = scs.name;
                    newSCS[index].workouts = ResultWorks;
                    //move it to the first position or not
                    if(scs.current){//first
                        newSCS.splice(index, 1);
                        newSCS.unshift(sp);
                    }else{//second
                        newSCS.splice(index, 1);
                        newSCS.splice(1, 0, sp);
                    }
                    update = true;
                    console.log("updated splits:");
                    console.log(newSCS);
                }
            });
           
        }
        //Id is empty or not found
        if(!update){//add it
            console.log("not founded, add it");
            var newSplit ={
                    name: scs.name,
                    ID: new mongoose.Types.ObjectId(),
                    workouts: ResultWorks
                }
            if(scs.current){//first
                newSCS.unshift(newSplit);
            }else{//second
                newSCS.splice(1, 0, newSplit);
            }
            console.log("add, new splits:");
            console.log(newSCS);
        }

        split.updateOne({scs: newSCS })
        .then(result => {
            console.log(">>> result:");
            console.log(result);
            if(result.modifiedCount === 1){
                console.log(">>> modified");
            }else{
                console.log(">>> not modified");
            }
            split.scs = newSCS;
            return res.status(200).json(split);
            
        }).catch(err => {
            console.error(err);
            return res.status(400).json({ 'message': 'SAVING error.' });
        });

    }else{//not exist
        console.log(">>> splits not exist");
        //create the split in SCS
        var newSplit ={
            name: scs.name,
            ID: new mongoose.Types.ObjectId(),
            workouts: ResultWorks
        }
        Splits.create({ //create new splits
            IdUser: req.body.data.IdUser,
            scs: [newSplit]
        }).then(result => {
            console.log(">>> created:");
           return res.status(200).json(result); 
        }
        ).catch(err => {
            console.error(err);
            return res.status(400).json({ 'message': 'CREATION error.' });
        });

    }
   
}

//ATTENTION: delete all the splits of the user
const deleteSplitsOf = async (req, res) => {
    console.log(req.body);
    if (!req?.body?.IdUser) return res.status(400).json({ 'message': 'User ID required.' });
    if (!req?.body?.IDSplit) return res.status(400).json({ 'message': 'ID Split required.' });

    const splits = await Splits.findOne({ IdUser: req.body.IdUser }).exec();
    if (!splits) {
        return res.status(204).json({ "message": `No User matches ID ${req.body.IdUser}.` });
    }else{
        //delete the scs with IDSplit 
        var newSCS = [];
        splits.scs.forEach(function(split) {
            if(split.ID.toString() !== req.body.IDSplit){//if different then add it
                newSCS.push(split);
            }
        });
        splits.scs = newSCS;

    }
    const result = await splits.save();
    res.json(result);
}
/*
Return the splitswith the ID with the workouts filled
*/
const getSplitsOf = async (req, res) => {
    console.log(">>> getSplitsOf");
    if (!req?.params?.IdSplit) return res.status(400).json({ 'message': 'ID Split required.' });
    if (!req?.params?.IdUser) return res.status(400).json({ 'message': 'User ID required.' });

    console.log(">>> req.params:");
    console.log(req.params);
    const splits = await Splits.findOne({ IdUser: req.params.IdUser }).exec();
    if (!splits) {
        return res.status(403).json({ "message": `No splits matches ID User: ${req.params.IdUser}.` });
    }else{
        console.log(">>> splits exist");
        var result = [];
        var returnSplit;
        console.log(">>> req.params.IdSplit:");
        console.log(req.params.IdSplit);
        for (const split of splits.scs) {

            if(split.ID.toString() === req.params.IdSplit){
                console.log(">>> founded the split:");
                console.log(split);
                if(split.workouts?.length > 0){
                    console.log(">>> FINDING...");

                    const res = Workout.find({ 
                        IdUser: req.params.IdUser, 
                        _id: { $in: split.workouts } })
                    .then( (workout) => {
                        console.log(">>> workout founded:");
                        console.log(workout);
                        return workout;
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(400).json({ 'message': 'FINDING error.' });
                    });
                    result = res;
                    returnSplit = split;//split to be returned with workouts
                    console.log(">>> result:");
                    console.log(result);
                }else{
                    console.log(">>> no workouts in the split");
                    return res.status(200).json(split);
                }
            }
        }
        // const Allworkout = await Promise(result);
        const Allworkout = await result;
        console.log(">>> Allworkout:");
        console.log(Allworkout);
        
        if(!returnSplit){//TODO NUOVE SCHEDE
            console.log("No split matches the ID required");
            //so is new
            //maybe check if all the workout are found
            return res.status(200).json(undefined); 
        }else{
            if(returnSplit.workouts.length !== Allworkout.length){
                console.log(">>> ERROR: not all the workouts are found");
                return res.status(402).json({ 'message': 'ERROR: not all the workouts are found.' });
            }else{
                returnSplit.workouts = Allworkout;
                //maybe check if all the workout are found
                return res.status(200).json(returnSplit); 
            } 
        }
        
    }
}

const getAllSplits = async (req, res) => { //TODO
    console.log(">>> getAllSplits");
    if (!req?.params?.IdUser) return res.status(400).json({ 'message': 'User ID required.' });
    console.log(">>> IdUser:");
    console.log(req.params.IdUser);

    const splits = await Splits.findOne({ IdUser: req.params.IdUser }).exec();
    if (!splits) {
        return res.status(204).json({ "message": `No splits matches ID User: ${req.params.IdUser}.` });
    }
    console.log(">>> splits:");
    console.log(splits);
    res.json(splits);//all splits
}


module.exports = {
    getAllSplits,
    //createNewSplits,
    updateSplits,
    deleteSplitsOf,
    getSplitsOf
}
