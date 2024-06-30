const Assignment = require('../models/assignment');
const Submission = require('../models/submission');
const { answerKeyContainerClient, rubricContainerClient , assignmentContainerClient} = require('../config/azure');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { get } = require('http');
const jwt = require('jsonwebtoken');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createAssignment = async (req, res) => {
  try {
    console.log(req.body);
    const {
      courseid,
      assignmentname,
      assignmentdescription,
      submissiontype,
      prompt,
      maxscore,
      startdate,
      enddate,
    } = req.body;

    let AnswerKeyURL = null;
    let RubricURL = null;

    if (req.files) {
      if (req.files.answerKey) {
        const answerKeyFile = req.files.answerKey;
        if (answerKeyFile.size > MAX_FILE_SIZE) {
          return res.status(400).json({ error: 'Answer key file size exceeds the 5MB limit.' });
        }
        const fileExtension = path.extname(answerKeyFile.name);
        const blobName = `${uuidv4()}${fileExtension}`;
        const blockBlobClient = answerKeyContainerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(answerKeyFile.data, {
          blobHTTPHeaders: { blobContentType: answerKeyFile.mimetype },
        });

        AnswerKeyURL = blockBlobClient.url;
      }

      if (req.files.rubric) {
        const rubricFile = req.files.rubric;
        if (rubricFile.size > MAX_FILE_SIZE) {
          return res.status(400).json({ error: 'Rubric file size exceeds the 5MB limit.' });
        }
        const fileExtension = path.extname(rubricFile.name);
        const blobName = `${uuidv4()}${fileExtension}`;
        const blockBlobClient = rubricContainerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(rubricFile.data, {
          blobHTTPHeaders: { blobContentType: rubricFile.mimetype },
        });

        RubricURL = blockBlobClient.url;
      }
    }

    const assignment = await Assignment.create({
      courseid: courseid,
      assignmentname: assignmentname,
      assignmentdescription: assignmentdescription,
      submissiontype: submissiontype,
      answerkey: AnswerKeyURL,
      rubric: RubricURL,
      prompt: prompt,
      maxscore: maxscore,
      startdate: startdate,
      enddate: enddate,
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// const submitAssignment = async (req, res) => {
//   try {
//     const { id } = req.params; // Assignment ID
//     const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

//     if (!token) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
//     const userid = decodedToken.userid;
//     const { link, content } = req.body; // Submission details

//     const assignment = await Assignment.findByPk(id);
//     if (!assignment) {
//       return res.status(404).json({ error: 'Assignment not found' });
//     }

//     let fileURL = null;
//     let contentType = null;

//     if (assignment.submissiontype === 'file' && req.files && req.files.file) {
//       const file = req.files.file;
//       const fileExtension = path.extname(file.name).toLowerCase();
//       if (!['.html', '.css', '.js'].includes(fileExtension)) {
//         return res.status(400).json({ error: 'Invalid file type. Only HTML, CSS, and JavaScript files are allowed.' });
//       }
//       const blobName = `${uuidv4()}${fileExtension}`;
//       const blockBlobClient = assignmentContainerClient.getBlockBlobClient(blobName);

//       await blockBlobClient.uploadData(file.data, {
//         blobHTTPHeaders: { blobContentType: file.mimetype },
//       });

//       fileURL = blockBlobClient.url;
//       contentType = fileExtension.substring(1); // Remove the dot
//     }

//     if (assignment.submissiontype === 'link') {
//       contentType = 'link';
//     }

//     // Check if a submission already exists for the user and assignment
//     const existingSubmission = await Submission.findOne({
//       where: { assignmentid: id, userid: userid },
//     });

//     if (existingSubmission) {
//       // Delete the old file from Azure if a new file is uploaded
//       if (fileURL && existingSubmission.content) {
//         const oldBlobName = existingSubmission.content.split('/').pop();
//         const oldBlockBlobClient = assignmentContainerClient.getBlockBlobClient(oldBlobName);
//         await oldBlockBlobClient.delete();
//       }

//       // Update the existing submission
//       existingSubmission.contenttype = contentType;
//       existingSubmission.contentlink = link || null;
//       existingSubmission.content = fileURL || content || null;
//       await existingSubmission.save();
//       res.status(200).json({ message: 'Submission updated successfully', submission: existingSubmission });
//     } else {
//       // Create a new submission
//       const submission = await Submission.create({
//         assignmentid: id,
//         userid: userid,
//         submissiondate: new Date(),
//         contenttype: contentType,
//         contentlink: link || null,
//         content: fileURL || content || null,
//       });
//       res.status(201).json({ message: 'Submission successful', submission });
//     }
//   } catch (error) {
//     console.error('Error in submitAssignment:', error); 
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params; // Assignment ID
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
      console.error('No token provided'); // Log missing token
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    const userid = decodedToken.userid;
    const { link, content } = req.body; // Submission details

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      console.error(`Assignment not found: ${id}`); // Log missing assignment
      return res.status(404).json({ error: 'Assignment not found' });
    }

    let fileURL = null;
    let contentType = null;

    if (assignment.submissiontype === 'file' && req.files && req.files.file) {
      const file = req.files.file;
      const fileExtension = path.extname(file.name).toLowerCase();
      if (!['.html', '.css', '.js'].includes(fileExtension)) {
        console.error(`Invalid file type: ${fileExtension}`); // Log invalid file type
        return res.status(400).json({ error: 'Invalid file type. Only HTML, CSS, and JavaScript files are allowed.' });
      }
      const blobName = `${uuidv4()}${fileExtension}`;
      const blockBlobClient = assignmentContainerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.data, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      fileURL = blockBlobClient.url;
      contentType = fileExtension.substring(1); // Remove the dot
    }

    if (assignment.submissiontype === 'link') {
      contentType = 'link';
    }

    // Check if a submission already exists for the user and assignment
    const existingSubmission = await Submission.findOne({
      where: { assignmentid: id, userid: userid },
    });

    if (existingSubmission) {
      // Delete the old file from Azure if a new file is uploaded
      if (fileURL && existingSubmission.content) {
        const oldBlobName = existingSubmission.content.split('/').pop();
        const oldBlockBlobClient = assignmentContainerClient.getBlockBlobClient(oldBlobName);
        await oldBlockBlobClient.delete();
      }

      // Update the existing submission
      existingSubmission.contenttype = contentType;
      existingSubmission.contentlink = link || null;
      existingSubmission.content = fileURL || content || null;
      await existingSubmission.save();
      console.log('Submission updated successfully');
      res.status(200).json({ message: 'Submission updated successfully', submission: existingSubmission });
    } else {
      // Create a new submission
      const submission = await Submission.create({
        assignmentid: id,
        userid: userid,
        submissiondate: new Date(),
        contenttype: contentType,
        contentlink: link || null,
        content: fileURL || content || null,
      });
      console.log('Submission successful');
      res.status(201).json({ message: 'Submission successful', submission });
    }
  } catch (error) {
    console.error('Error:', error); 
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createAssignment , getAssignmentById , submitAssignment };
