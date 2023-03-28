// Setting LocalStorage
const setLocalStorage= (key, value)=> {
    localStorage.setItem(key, JSON.stringify(value));
};

// Remove Local Storage
const removeLocalStorage= (key)=> {
    localStorage.removeItem(key);
};

// Get Local Storage by Key
const getLocalStorageByKey = (key)=> {
    return JSON.parse(localStorage?.getItem(key));
}

export {
    setLocalStorage,
    removeLocalStorage,
    getLocalStorageByKey
}