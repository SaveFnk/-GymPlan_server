const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/historyController');

router.route('/')//CHANGE
    .post(historyController.createNewHistory)
    .put(historyController.updateHistory)
    .delete(historyController.deleteHistory);

router.route('/:IdUser')//
    .get(historyController.getHistoryOf);

module.exports = router;