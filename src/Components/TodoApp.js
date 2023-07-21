import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import './TodoApp.css'

const TodoApp = () => {
    const [todo, setTodo] = useState('');
    const [editedTodo, setEditedTodo] = useState('');
    const [todos, setTodos] = useState([]);  /*([].map((text, id) => ({ id, text })));*/
    const [id, setId] = useState(0);
    const [isEditing, setIsEditing] = useState(null);




    const groupProps = {
        appear: true,
        enter: true,
        exit: true,
    };



    useEffect(() => {
        // Get todos from localStorage
        const todosFromLocalStorage = localStorage.getItem('todos');
        if (todosFromLocalStorage) {
            const todosArray = JSON.parse(todosFromLocalStorage);
            setTodos(todosArray);
        }
    }, []);



    const add = (event) => {
        event.preventDefault();
        setId((prevId) => prevId + 1);
        setTodos((prevTodos) => [
            ...prevTodos,
            { id, text: todo || '-' },
        ]);
        setTodo('');

        // Save todos to localStorage
        setTodos((updatedTodos) => {
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
    };



    const remove = (event) => {
        const itemId = +event.currentTarget.getAttribute('data-id');
        setTodos((prevTodos) => prevTodos.filter((item) => item.id !== itemId));

        // Save todos to localStorage
        setTodos((updatedTodos) => {
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
    };


    const handleChange = (event) => {
        const { value } = event.target;
        setTodo(value);
    };

    const startEdit = (id) => {
        setIsEditing(id);
        const itemToEdit = todos.find((item) => item.id === id);
        setEditedTodo(itemToEdit.text);
    };


    const saveEdit = () => {
        setTodos((prevTodos) =>
            prevTodos.map((item) => (item.id === isEditing ? { ...item, text: editedTodo } : item))
        );
        setIsEditing(null);

        // Save todos to localStorage
        setTodos((updatedTodos) => {
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return updatedTodos;
        });
    };


    const getTextAreaRows = (text) => {

        const minRows = 1;
        const maxRows = 10;
        const newlineCount = (text.match(/\n/g) || []).length;
        const rowCount = Math.min(Math.max(minRows, newlineCount + 1), maxRows);

        return rowCount;
    };

    const reverseTodos = () => {
        setTodos((prevTodos) => [...prevTodos].reverse());
        // Save todos to localStorage
        localStorage.setItem('todos', JSON.stringify([...todos].reverse()));
    };

    return (
        <div className='main-container slider-thumb'>

            <div className='form-container'>

                <h1 data-shadow='~To-Do'>~To-Do</h1>

                <form onSubmit={add} className='form' autoComplete='off'>
                    <div className='input'>
                        <div className='input-group'>
                            <textarea
                                type='text'
                                className='form-control'
                                id='todoField'
                                placeholder='Add To-Do'
                                name='todo'
                                rows={getTextAreaRows}
                                value={todo}
                                onChange={handleChange}
                            />
                            <div className='input-group-buttons'>
                                <button onClick={add} className='btn btn-add' type='button'>
                                    <span class="material-symbols-outlined">
                                        add
                                    </span>
                                </button>

                                <button onClick={reverseTodos} className='btn btn-reverse' type='button'>
                                    <span class="material-symbols-outlined">
                                        swap_vert
                                    </span>
                                </button>
                            </div>
                        </div>
                        <p className='form-text text-muted'>
                            To-Do : {todos.length}
                        </p>
                    </div>



                    <div className='todo-list list'>
                        <TransitionGroup {...groupProps}>
                            {todos.map((item) => (
                                <Fade key={item.id} collapse right>
                                    <div className='input'>
                                        <div className='input-group'>

                                            {isEditing === item.id ? (
                                                <textarea
                                                    type='text'
                                                    rows={getTextAreaRows}
                                                    className='form-control'
                                                    name='editedTodo'
                                                    value={editedTodo}
                                                    required

                                                    onChange={(e) => setEditedTodo(e.target.value)}
                                                />
                                            ) : (


                                                <textarea
                                                    className='form-control'
                                                    rows={getTextAreaRows}
                                                    readOnly
                                                    value={item.text}
                                                ></textarea>



                                            )}
                                            <div className='input-group-buttons'>
                                                {isEditing === item.id ? (
                                                    <button
                                                        onClick={saveEdit}
                                                        type='button'
                                                        className='btn btn-sm btn-save mr-2'
                                                    >
                                                        <span class="material-symbols-outlined">
                                                            save
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(item.id)}
                                                        type='button'
                                                        className='btn btn-sm btn-edit mr-2'
                                                    >
                                                        <span class="material-symbols-outlined">
                                                            edit
                                                        </span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={remove}
                                                    data-id={item.id}
                                                    type='button'
                                                    className='btn btn-sm btn-remove'
                                                >
                                                    <span class="material-symbols-outlined">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                </Fade>
                            ))}
                        </TransitionGroup>
                    </div>
                </form>
            </div>
        </div>



    );
};

export default TodoApp;
