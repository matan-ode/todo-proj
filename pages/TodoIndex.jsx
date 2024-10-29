const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { loadTodos, removeTodo, saveTodo } from '../store/actions/todo.actions.js'
import { SET_FILTER_BY } from '../store/store.js'
import { changeBalance } from '../store/actions/user.actions.js'
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { SET_TODOS } from "../store/store.js"


export function TodoIndex() {

    // const [todos, setTodos] = useState(null)
    const todos = useSelector(storeState => storeState.todos)
    const isLoading = useSelector(storeState => storeState.isLoading)


    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    // const [filterBy, setFilterBy] = useState(defaultFilter)
    const filterBy = useSelector((storeState) => storeState.filterBy)

    const dispatch = useDispatch()

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(() => {
                showErrorMsg('Could not load todos')
            })
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const ans = confirm('Do you want to delete this todo?')
        if (!ans) return
        removeTodo(todoId)
            .then(() => {
                showSuccessMsg(`Removed todo with ${todoId} id successfully`)
            })
            .catch(() => {
                showErrorMsg('Had trouble removing the todo')
            })
    }

    function onSetFilterBy(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then(() => {
                showSuccessMsg(`Updated ${todoToSave.txt} successfully`)
                if (todoToSave.isDone) {
                    return changeBalance(10)
                }
            })
            .catch(() => showErrorMsg('Had trouble updating the todo'))
            .finally(() => filterBy.isDone !== 'all' ? loadTodos(filterBy):'')
    }
    const { txt, importance, isDone } = defaultFilter

    // if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={{ txt, importance, isDone }} onSetFilterBy={onSetFilterBy} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {isLoading
                ? <div>Loading...</div>
                : <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            }
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}