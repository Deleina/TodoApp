import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw'
import { renderPending } from './use-cases/renderPending';
import { renderTodos } from './use-cases/renderTodos';



const elementIds = {
    TodoFilter: '.filtro',
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    newTodoInput: '#new-todo-input',
    PendinCountLabel:'#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */

export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(elementIds.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(elementIds.PendinCountLabel);
    }



    //cuando la funcion app() se llama
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app)
        displayTodos();
    })();


    //referencias HTML
    const newDescriptionInput = document.querySelector(elementIds.newTodoInput);
    const todoListUL = document.querySelector(elementIds.TodoList)
    const clearCompletedButton = document.querySelector(elementIds.ClearCompleted)
    const filterLIs = document.querySelectorAll(elementIds.TodoFilter)



    //listeners 
    newDescriptionInput.addEventListener('keyup', (e) => {
        if (e.keyCode !== 13) return;
        if (e.target.value.trim().length === 0) return;

        todoStore.addTodo(e.target.value);
        displayTodos();
        e.target.value = ''
    });


    todoListUL.addEventListener('click', (e) => {
        const element = e.target.closest('[data-id]');
        todoStore.togleTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    todoListUL.addEventListener('click', (e) => {
        const isDestroyElement = e.target.className === 'destroy';
        const element = e.target.closest('[data-id]');

        if (!element || !isDestroyElement) {
            return
        }

        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    })


    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos()
    })


    filterLIs.forEach(element => {

        element.addEventListener('click', (element) => {
            filterLIs.forEach(el => el.classList.remove('selected'))
            element.target.classList.add('selected')

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break;

                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;

                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;
            }

            displayTodos();
        })
    })
}
