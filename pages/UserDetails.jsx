const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM
const { useSelector, } = ReactRedux
import { ActivityList } from '../cmps/ActivityList.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'
import { updateUser } from '../store/actions/user.actions.js'

export function UserDetails() {
    const loggedinUser = useSelector((storeState) => storeState.userModule.loggedinUser)
    const [userToEdit, setUserToEdit] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedinUser) navigate('/')
        else loadUserToEdit()
    }, [loggedinUser])

    function loadUserToEdit() {
        setUserToEdit({
            fullname: loggedinUser.fullname || '',
            color: loggedinUser.prefs.color || '#eeeeee',
            bgColor: loggedinUser.prefs.bgColor || '#191919',
        })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }
        setUserToEdit((prevUser) => ({ ...prevUser, [field]: value }))
    }

    function onEditUser(ev) {
        ev.preventDefault()
        const userToUpdate = {
            fullname: userToEdit.fullname,
            prefs: { color: userToEdit.color, bgColor: userToEdit.bgColor }
        }
        updateUser(userToUpdate)
            .then(() => {
                showSuccessMsg('User updated successfully!')
            })
            .catch(err => {
                console.error('Cannot update user:', err)
                showErrorMsg('Cannot update user')
            })
    }

    function getActivityTime(activity) {
        const { at } = activity
        return utilService.getFormattedTime(at)
    }

    if (!userToEdit || !loggedinUser) return null
    const { activities } = loggedinUser
    return (
        <div className='container'>
            <h1>Profile</h1>
            <form className='activities-form' onSubmit={onEditUser}>
                <label htmlFor="fullname">Name:</label>
                <input type="text" id="fullname" name="fullname" value={userToEdit.fullname} onChange={handleChange} />
                <label htmlFor="name">Color:</label>
                <input type="color" name="color" value={userToEdit.color} onChange={handleChange} />
                <label htmlFor="name">BG Color:</label>
                <input type="color" name="bgColor" value={userToEdit.bgColor} onChange={handleChange} />
                <button type="submit">save</button>
            </form>

            <ActivityList
                activities={activities}
                getActivityTime={getActivityTime}
            />
        </div>
    )
}
