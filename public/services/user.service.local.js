import { storageService } from './async-storage.service.js'

export const bugService = {
    login,
    signup,
    logout,
    getLoggedinUser,

    getById,
    getEmptyCredential
}

const KEY = 'userDB' // local storage key
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser' // session storage key


function login({userName, password}) {
    return storageService.query(KEY) 
        .then(users => { 
            const user = users.find(user => user.userName === userName && user.password === password)
            if (user) return _setLoggedinUser(user) 
            else return Promise.reject('Invalid login')      
        })

}

function signup({userName, password, fullName}) {
    const user ={userName, password, fullName}
    return storageService.post(KEY, user) 
        .then(_setLoggedinUser) 
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER) 
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) 
}
function getById(userId) {
    return storageService.get(STORAGE_KEY_LOGGEDIN_USER, userId)
}

function getEmptyCredential() {
    return {
        userName: '',
        password: '',
        fullName: ''
    }
}

function _setLoggedinUser(user) {
    const userToSave = {_id: user._id, fullName: user.fullName}
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}




