const express = require('express');
const router = express.Router();
const workoutController = require('../../controllers/workoutController');

router.route('/')//CHANGE
    //.get(workoutController.getWorkoutOf)
    //.post(workoutController.createNewWorkout)
    //.put(workoutController.updateWorkout)
    //.delete(workoutController.deleteWorkout);

router.route('/:IdUser')//
    .get(workoutController.getAllWorkouts);

module.exports = router;