import {
    setCookie,
    removeCookie, 
    getCookie,
    setLocalStorage,
    removeLocalStorage 
} from './utils';

// Getting current authentication status
const userIsAuth = ()=> {
    // Getting cookie
    const cookieCheck = getCookie('token');
    if(cookieCheck) {
        if(localStorage?.getItem('user')) {
            return JSON.parse(localStorage?.getItem('user'));
        }else {
            return false;
        }
    }
}

// Authenticating user
const authenticateUser = (data)=> {
    // Reseting 
    removeCookie('token');
    removeLocalStorage('user');
    // Setting
    setCookie('token', data?.token);
    setLocalStorage('user', data?.user);
    // Validation
    if(userIsAuth()=== false) {
        console.log("Not Authenticated");
        return false;
    }else {
        console.log("Authenticated");
        return true;
    }  
}

// Signout
const signoutUser = ()=> {
    removeCookie("token");
    removeLocalStorage("user");
}

export {
    authenticateUser,
    userIsAuth,
    signoutUser,
};