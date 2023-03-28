import cookie from 'js-cookie';

// Set Cookie
const setCookie= (key, value)=> {
    cookie.set(key, value, {
        expires: 1,
    });
};

// Remove Cookie
const removeCookie= (key)=> {
    cookie.remove(key, {
        expires: 1,
    });
};

// Get cookie
const getCookie= (key)=> {
    return cookie.get(key);
};

export {
    setCookie,
    removeCookie,
    getCookie
};