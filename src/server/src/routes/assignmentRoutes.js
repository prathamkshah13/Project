const express = require('express');
const fileUpload = require('express-fileupload');
const { createAssignment , getAssignmentById , submitAssignment} = require('../controllers/assignmentController');
const router = express.Router();

router.use(fileUpload());

router.post('/create-assignments', createAssignment);
router.get('/:id', getAssignmentById);
router.post('/:id/submit', submitAssignment);

module.exports = router;
