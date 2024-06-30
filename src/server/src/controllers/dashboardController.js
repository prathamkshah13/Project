const { Course } = require('../models/course');
const { Announcement } = require('../models/announcement');
const { Assignment } = require('../models/assignment');

const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ where: { CourseID: 1 } }); // Assuming CourseID is 1
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({ where: { CourseID: 1 } });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({ where: { CourseID: 1 } });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCourse,
  getAnnouncements,
  getAssignments,
};