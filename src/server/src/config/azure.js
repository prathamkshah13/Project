const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

const assignmentContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_ASSIGNMENT_CONTAINER_NAME);
const rubricContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_RUBRIC_CONTAINER_NAME);
const answerKeyContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_ANSWER_KEY_CONTAINER_NAME);

module.exports = { assignmentContainerClient, rubricContainerClient , answerKeyContainerClient};
