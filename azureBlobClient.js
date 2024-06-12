const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=strbloom;AccountKey=JqeT5Ai2iHi80NWS5mGv+9YKrP6mZRxzBSD2VG8ua6W54VFcqCqi/DjhrmE6qDd0sPctiazL44At+ASt8jmw9w==;EndpointSuffix=core.windows.net');
const containerName = process.env.CONTAINER_NAME;

const getBlobUrl = async (blobName) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    return blobClient.url;
};

module.exports = { getBlobUrl };
