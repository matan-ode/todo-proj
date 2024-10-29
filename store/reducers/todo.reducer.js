import { todoService } from '../../services/todo.service.js'

// Todos
export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_DONE_TODOS_PERCENT = 'SET_DONE_TODOS_PERCENT'
export const REMOVE_TODO_UNDO = 'REMOVE_TODO_UNDO'


// Loading
export const SET_IS_LOADING = 'SET_IS_LOADING'

// FilterBy
export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialState = {
    todos: [],
    prevTodos: [],
    isLoading: false,
    filterBy: todoService.getDefaultFilter(),
    doneTodosPercent: 0,
}

export function todoReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        //TODO
        case SET_TODOS:
            return { ...state, todos: cmd.todos }
        case REMOVE_TODO:
            return {
                ...state, 
                prevTodos: [...state.todos],
                todos: state.todos.filter(todo => todo._id !== cmd.todoId),
            }
        case REMOVE_TODO_UNDO:
            return { ...state, todos: [...state.prevTodos] }
        case ADD_TODO:
            return { ...state, todos: [...state.todos, cmd.todo] }
        case UPDATE_TODO:
            return { ...state, todos: state.todos.map(todo => (todo._id === cmd.todo._id) ? cmd.todo : todo) }
        case SET_FILTER_BY:
            return { ...state, filterBy: { ...state.filterBy, ...cmd.filterBy } }
        case SET_DONE_TODOS_PERCENT:
            return { ...state, doneTodosPercent: cmd.doneTodosPercent }
        case SET_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        default:
            return state
    }
}