const { createStore } = Redux
import { userService } from '../services/user.service.js'
import { todoService } from '../services/todo.service.js'


// Todos
export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_DONE_TODOS_PERCENT = 'SET_DONE_TODOS_PERCENT'

// Loading
export const SET_IS_LOADING = 'SET_IS_LOADING'

// FilterBy
export const SET_FILTER_BY = 'SET_FILTER_BY'

// User
export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'


const initialState = {
    todos: [],
    loggedinUser: userService.getLoggedinUser(),
    isLoading: false,
    filterBy: todoService.getDefaultFilter(),
    doneTodosPercent: 0,
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        //TODO
        case SET_TODOS:
            return { ...state, todos: cmd.todos }
        case REMOVE_TODO:
            return { ...state, todos: state.todos.filter(todo => todo._id !== cmd.todoId) }
        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }
        case UPDATE_TODO:
            return { ...state, todos: state.todos.map(todo => (todo._id === cmd.todo._id) ? cmd.todo : todo) }
        case SET_FILTER_BY:
            return { ...state, filterBy: { ...state.filterBy, ...cmd.filterBy } }
        case SET_DONE_TODOS_PERCENT:
            return { ...state, doneTodosPercent: cmd.doneTodosPercent }

        //USER
        case SET_USER:
            return { ...state, loggedinUser: cmd.user }
        case SET_USER_BALANCE:
            if (!state.loggedinUser) return state
            return { ...state, loggedinUser: { ...state.loggedinUser, balance: cmd.balance } }
        case SET_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        default:
            return state
    }
}

export const store = createStore(appReducer)

// window.gStore = store