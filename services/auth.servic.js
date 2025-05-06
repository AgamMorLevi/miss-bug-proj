import Cryptr from 'cryptr'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')
const users = utilService.readJsonFile('data/user.json')


export const authService = {
    checkLogin,
	getLoginToken,
	validateToken,
}

function checkLogin({ username, password }) {
// You might want to remove the password validation for dev
var user = users.find(user => user.username === username && user.password === password)
if (user){
    user ={
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
    return Promise.resolve(user)
}
}

function getLoginToken(user) {
	const str = JSON.stringify(user)
	const encryptedStr = cryptr.encrypt(str)
	return encryptedStr
}

function validateToken(token) {
	if (!token) return null
    
	const str = cryptr.decrypt(token)
	const user = JSON.parse(str)
	return user
}