import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/enrollment';

// Fetching all classes
const fetchAllEnrollmentByUser = (user)=>
    fetchCall(
        `${SERVICE_BASE_URL}/getEnrolledCoursesByUser/${user}`,
        config?.requestMethod['GET'],
        {},
        true
    )

export const enrollmentServices = {
    fetchAllEnrollmentByUser
}