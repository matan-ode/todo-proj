import { todoService } from "../../services/todo.service.js"
import { ADD_TODO, REMOVE_TODO, SET_TODOS, SET_IS_LOADING, store, UPDATE_TODO, SET_DONE_TODOS_PERCENT } from "../store.js"
import { addActivity } from './user.actions.js'

export function loadTodos(filterBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.query(filterBy)
        .then(({ todos, doneTodosPercent }) => {
            store.dispatch({ type: SET_TODOS, todos })
            _setTodosData(doneTodosPercent)
            return todos
        })
        .catch(err => {
            console.log('Todo actions -> Cannot load todos:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function saveTodo(todo) {

    const type = todo._id ? UPDATE_TODO : ADD_TODO

    return todoService.save(todo)
        .then(({savedTodo, doneTodosPercent}) => {
            store.dispatch({ type, todo: savedTodo })
            _setTodosData(doneTodosPercent)
            return savedTodo
        })
        .then(res => {
            const actionName = (todo._id) ? 'Updated' : 'Added'
            return addActivity(`${actionName} a Todo: ` + todo.txt)
                .then(() => res)
        })
        .catch(err => {
            console.log('Todo actions -> Cannot save todo:', err)
            throw err
        })
}

export function removeTodo(todoId) {

    return todoService.remove(todoId)
        .then(({doneTodosPercent}) => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            _setTodosData(doneTodosPercent)
        })
        .then(() => addActivity('Removed the Todo: ' + todoId))
        .catch(err => {
            console.log('Todo actions -> Cannot remove todo:', err)
            throw err
        })
}

function _setTodosData(doneTodosPercent, maxPage) {
    store.dispatch({ type: SET_DONE_TODOS_PERCENT, doneTodosPercent })
    // store.dispatch({ type: SET_MAX_PAGE, maxPage })
}
