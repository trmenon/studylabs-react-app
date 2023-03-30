import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/class';

// Fetching all classes
const fetchAllClasses = ()=>
    fetchCall(
        `${SERVICE_BASE_URL}/getAllClasses`,
        config?.requestMethod['GET'],
        {},
        true
    )

// Creating new Class
const createNewClass = (data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/createNewClass`,
        config?.requestMethod['POST'],
        data,
        true
    )

// fetching details of class by ID
const fetchClassById = (id)=>
    fetchCall(
        `${SERVICE_BASE_URL}/getClassById/${id}`,
        config?.requestMethod['GET'],
        {},
        true
    )

// Toggle status of class by ID
const toggleClassStatusById = (id)=>
    fetchCall(
        `${SERVICE_BASE_URL}/toggleClassStatus/${id}`,
        config?.requestMethod['PUT'],
        {},
        true
    )

// fetching details of class by TUTOR-ID
const fetchClassByTutor = (id)=>
    fetchCall(
        `${SERVICE_BASE_URL}/getClassByTutor/${id}`,
        config?.requestMethod['GET'],
        {},
        true
    )

// Updating new notes to class archives
const updateNotesToClassArchive = (id, note)=>
    fetchCall(
        `${SERVICE_BASE_URL}/updateNotesToClass/${id}/${note}`,
        config?.requestMethod['PUT'],
        {},
        true
    )

// Updating new notes to class archives
const updateClassEnrollment = (data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/enrollStudent`,
        config?.requestMethod['PUT'],
        data,
        true
    )

export const classServices = {
    fetchAllClasses,
    createNewClass,
    fetchClassById,
    toggleClassStatusById,
    fetchClassByTutor,
    updateNotesToClassArchive,
    updateClassEnrollment
}