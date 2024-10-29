const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

const { useSelector } = ReactRedux

import { logout } from '../store/actions/user.actions.js'

import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'


export function AppHeader() {
    const navigate = useNavigate()
    // const [user, setUser] = useState(userService.getLoggedinUser())
    const todos = useSelector((storeState) => storeState.todos)
    const loggedinUser = useSelector((storeState) => storeState.loggedinUser)
    const doneTodosPercent = useSelector((storeState) => storeState.doneTodosPercent)


    function onLogout() {
        logout()
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function getStyleByUser() {
        const prefs = {}
        if (loggedinUser && loggedinUser.prefs) {
            prefs.color = loggedinUser.prefs.color
            prefs.backgroundColor = loggedinUser.prefs.bgColor
        }
        return prefs
    }

    const formattedPercent = todos ? doneTodosPercent.toFixed(2) + '%' : null

    return (
        <header style={getStyleByUser()} className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {loggedinUser ? (
                    < section >
                        <div>
                            <Link to={`/user/${loggedinUser._id}`}>Hello {loggedinUser.fullname}</Link>
                            <p>Your balance is {loggedinUser.balance}</p>
                            <button onClick={onLogout}>Logout</button>
                        </div>
                        {todos &&
                            <section className="todos-progress">
                                <h3>you have finished {formattedPercent}</h3>
                                <div className="progress-bar-container" >
                                    <span>{formattedPercent}</span>
                                    <div style={{ width: formattedPercent }}>

                                    </div>
                                </div>
                            </section>
                        }
                    </ section >

                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    {/* <NavLink to="/about" >About</NavLink> */}
                    <NavLink to="/todo" >Todos</NavLink>
                    {/* <NavLink to="/dashboard" >Dashboard</NavLink> */}
                    <NavLink to="/user" >User profile</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
