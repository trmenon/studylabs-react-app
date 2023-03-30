import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/asset';

// Uploading file 
const uploadFile = (data)=> 
    fetchCall(
        `${SERVICE_BASE_URL}/upload`,
        config.requestMethod.POST,
        data,
        true,
        {},
        true
    );

// Getting stock media
const downloadFile = (data)=> 
    fetchCall(
        `/asset/download/${data}`,
        config.requestMethod.GET,
        {},
        true
    );

export const assetServices = {
    uploadFile,
    downloadFile
}