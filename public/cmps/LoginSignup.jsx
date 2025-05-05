const { useState } = React

import { showErrorMsg ,showSuccessMsg } from "../services/event-bus.service"
import { userService } from "../services/user.service.local.js"
import{userService} from '../services/user.service.local.js'

export function LoginSignup({ onSetUser }) {
    const [isSingup, setIsSingup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredential())

    function handleChange({ target }) {
        const { name, value } = target
        setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        isSingup ? signup(credentials) : login(credentials)
       
    }

    function login(credentials) {
        userService.login(credentials)
            .then(onSetUser)
            .then(() => {showSuccessMsg('Welcome back!')}) 
            .catch((err) => {showErrorMsg('Login failed, please try again')})
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onSetUser)
            .then(() => {showSuccessMsg('Welcome aboard!')}) 
            .catch((err) => {showErrorMsg('Signup failed, please try again')})
    }


    return (
        <div className="login-page flex column align-center">
            <form className="login-form flex column align-center" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="userName"
                    value={credentials.userName}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input 
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSingup && (
                    <input 
                        type="text"
                        name="fullName"
                        value={credentials.fullName}
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                )}
                <button type="submit" className="btn-login-signup">{isSingup ? 'Sign Up' : 'Login'} </button>
            </form>

        </div>
     
    )
}
