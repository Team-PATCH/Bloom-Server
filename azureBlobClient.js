const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');

dotenv.config();


const blobServiceClient = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=strbloom;AccountKey=MwTCKg0zDrblyizMhaqKLBmQnIesp5V95uUz6DP8SuTx3Avks3t5MawYwPZdyKzCkisAR4SM8BBc+AStiJCmDw==;EndpointSuffix=core.windows.net');
const containerName = 'product';


const getBlobUrl = async (blobName) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    return blobClient.url;
};

module.exports = { getBlobUrl };
