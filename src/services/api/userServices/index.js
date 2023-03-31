import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

const signin = (data)=> 
    fetchCall(
        "/user/signin",
        config.requestMethod.POST,
        data
    );

const createAdminAccount = (data)=> 
    fetchCall(
        "/user/createUser/admin",
        config.requestMethod.POST,
        data
    );
const createTutorAccount = (data)=> 
    fetchCall(
        "/user/createUser/tutor",
        config.requestMethod.POST,
        data
    );
const createStudentAccount = (data)=> 
    fetchCall(
        "/user/createUser/student",
        config.requestMethod.POST,
        data
    );

const signout = ()=> 
    fetchCall(
        "/user/signout",
        config.requestMethod.GET,
        {}
    );

const fetchAllUsers = ()=>
    fetchCall(
        "/user/getAllUsers",
        config?.requestMethod['GET'],
        {},
        true
    )

const fetchAllTutors = ()=>
    fetchCall(
        "/user/getAllTutors",
        config?.requestMethod['GET'],
        {},
        true
    )

const fetchAllUsersByRole = (role)=>
    fetchCall(
        `/user/getAllUsersByRole/${role}`,
        config?.requestMethod['GET'],
        {},
        true
    )

const fetchUserById = (id)=>
    fetchCall(
        `/user/getUserById/${id}`,
        config?.requestMethod['GET'],
        {},
        true
    )

const deleteUserById = (id)=>
    fetchCall(
        `/user/deleteUser/${id}`,
        config?.requestMethod['PUT'],
        {},
        true
    )

export const userServices = {
    signin,
    createAdminAccount,
    createTutorAccount,
    createStudentAccount,
    signout,
    fetchAllUsers,
    fetchUserById,
    deleteUserById,
    fetchAllTutors,
    fetchAllUsersByRole
};