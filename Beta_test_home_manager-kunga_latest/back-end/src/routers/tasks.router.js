const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasks.controller');

router.get('/', controller.getAllIncompleteTasks);
router.get('/:id', controller.getTask);
router.post('/', controller.createTask);
router.put('/:id/assign', controller.assignTaskToMember); // Route for task assignment



module.exports = router;
