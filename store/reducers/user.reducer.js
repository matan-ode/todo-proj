import { userService } from '../../services/user.service.js'

// User
export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'


const initialState = {
    loggedinUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        //USER
        case SET_USER:
            return { ...state, loggedinUser: cmd.user }
        case SET_USER_BALANCE:
            if (!state.loggedinUser) return state
            return { ...state, loggedinUser: { ...state.loggedinUser, balance: cmd.balance } }

        default:
            return state
    }
}
