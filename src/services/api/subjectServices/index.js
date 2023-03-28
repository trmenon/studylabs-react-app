import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

const SERVICE_BASE_URL = '/subject';

// Creating new subject
const createNewSubject = (data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/createSubject`,
        config?.requestMethod['POST'],
        data,
        true
    );

// Fetching all subjects
const getAllSubjects = ()=> 
    fetchCall(
        `${SERVICE_BASE_URL}/getAllSubjects`,
        config?.requestMethod['GET'],
        {},
        true
    );

// Fetching subject by id
const getSubjectById = (id)=> 
    fetchCall(
        `${SERVICE_BASE_URL}/getSubjectById/${id}`,
        config?.requestMethod['GET'],
        {},
        true
    );

export const subjectServices = {
    createNewSubject,
    getAllSubjects,
    getSubjectById,
}