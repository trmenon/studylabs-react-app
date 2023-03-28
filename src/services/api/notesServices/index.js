import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/notes';

// Creating new Note
const createNewNote = (data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/createNewNote`,
        config?.requestMethod['POST'],
        data,
        true
    );

export const notesServices = {
    createNewNote
}