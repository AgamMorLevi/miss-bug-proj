const { useState } = React

const { Link, NavLink } = ReactRouterDOM
const {useNavigate} = ReactRouterDOM

import{ userService} from '../services/user.service.local.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function AppHeader() {
    // const navigate = useNavigate()
    // const [user , setUser] = useState(userService.getLoggedinUser())

    // function onLogout() {
    //     userService.logout()
    //         .then(() => onSetUser(null))
    //         .catch(err => showErrorMsg('Could not log out, please try again later'))
    // }

    // function onSetUser(user) {
    //     setUser(user)
    // }

 
    return (
    <header className="app-header main-content single-row">
        <section className="header-container flex align-center">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>      
        </nav>
        </section>
{/* 
        {user ? (
            <section className="user-container flex align-center">
                <Link to={`/user/${user._id}`}>Welcome {user.fullName}</Link>
                <button onClick={onLogout}>Logout</button>
            </section>
        ) : (
            <section className="user-container flex align-center">
                <LoginSignup onSetUser={onSetUser} />
                
            </section>
        )}
        <UserMsg/> */}
    </header>
)
}