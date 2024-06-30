const express = require('express');
const { getCourse, getAnnouncements, getAssignments } = require('../controllers/dashboardController');
const router = express.Router();

// Route to get course details
router.get('/course', getCourse);
//router.get('/course', (req,res) => {
   // res.send("course");
//})
// Route to get announcements
router.get('/announcements', getAnnouncements);

// Route to get assignments
router.get('/assignments', getAssignments);

module.exports = router;