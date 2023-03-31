import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/common';

// Fetching all classes
const fetchAllRoles = ()=>
    fetchCall(
        `${SERVICE_BASE_URL}/fetchAllRoles`,
        config?.requestMethod['GET'],
        {},
        true
    )

export const commonServices = {
    fetchAllRoles 
}