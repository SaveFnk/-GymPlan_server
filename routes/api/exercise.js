const express = require('express');
const router = express.Router();
const workoutController = require('../../controllers/exerciseController');

router.route('/')//CHANGE
    .post(workoutController.createNewExercise)
    .put(workoutController.updateExercise)
    .delete(workoutController.deleteExercise);

router.route('/:IdUser')//
    .get(workoutController.getAllExercise);

module.exports = router;