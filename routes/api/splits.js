const express = require('express');
const router = express.Router();
const splitsController = require('../../controllers/splitsController');

router.route('/')//CHANGE
    //.post(splitsController.createNewSplits)
    .post(splitsController.updateSplits)
    .put(splitsController.updateSplits)
    .delete(splitsController.deleteSplitsOf);

router.route('/:IdUser')//#### TODO
    .get(splitsController.getAllSplits);

router.route('/:IdUser/:IdSplit')//#### TODO
    .get(splitsController.getSplitsOf);

module.exports = router;