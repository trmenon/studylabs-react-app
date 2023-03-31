import { userServices } from "../userServices";
import { subjectServices } from "../subjectServices";
import { commonServices } from "../commonServices";
import { v4 } from "uuid";

const populateSubject = async ()=> {
    try{
        return await subjectServices
            .getAllSubjects()
            .toPromise()
            .then((data)=> {
                if(
                    data &&
                    data?.success === true &&
                    data?.data &&
                    data?.data?.data &&
                    Array.isArray(data?.data?.data)
                ) {
                    return data?.data?.data.map((option)=> ({
                        key: v4(),
                        value: option._id,
                        label: option.subjectTitle
                    }))
                }
            })
    }catch(err) {
        console.log('[ERROR] Populating subjects as list');
        console.log(err);
    }
}
const populateTutors = async ()=> {
    try{
        return await userServices
            .fetchAllTutors()
            .toPromise()
            .then((data)=> {
                if(
                    data &&
                    data?.success === true &&
                    data?.data &&
                    data?.data?.data &&
                    Array.isArray(data?.data?.data)
                ) {
                    return data?.data?.data.map((option)=> ({
                        key: v4(),
                        value: option._id,
                        label: `${option.firstName} ${option?.lastName}`
                    }))
                }
            })
    }catch(err) {
        console.log('[ERROR] Populating tutors as list');
        console.log(err);
    }
}
const populateRoles = async ()=> {
    try{
        return await commonServices
            .fetchAllRoles()
            .toPromise()
            .then((data)=> {
                if(
                    data &&
                    data?.success === true &&
                    data?.data &&
                    data?.data?.user_roles &&
                    Array.isArray(data?.data?.user_roles)
                ) {
                    return data?.data?.user_roles.map((option)=> ({
                        key: v4(),
                        value: option.value,
                        label: option?.label
                    }))
                }
            })
    }catch(err) {
        console.log('[ERROR] Populating user roles as list');
        console.log(err);
    }
}

export const populators = {
    populateSubject,
    populateTutors,
    populateRoles
}