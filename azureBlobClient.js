const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
const containerName = process.env.CONTAINER_NAME;

const getBlobUrl = async (blobName) => {
    console.log(containerName)
    console.log(blobServiceClient)
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    return blobClient.url;
};

module.exports = { getBlobUrl };
