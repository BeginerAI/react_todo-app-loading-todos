/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItems } from './components/TodoItems';
import classNames from 'classnames';

// const a = [
//   { id: 1, title: 'goood1', completed: false, userId: 3 },
//   { id: 2, title: 'goood2', completed: true, userId: 5 },
// ];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortTodos, setSortTodos] = useState(todos);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setfilter] = useState('All');
  const [allActive, setAllActive] = useState(false);

  useEffect(() => {
    getTodos()
      .then(data => {
        JSON.stringify(data);
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    // setTodos(a);
    switch (filter) {
      case 'All':
        setSortTodos(todos);
        break;

      case 'Active': {
        setSortTodos(todos.filter(todo => todo.completed === false));
        break;
      }

      case 'Completed': {
        setSortTodos(todos.filter(todo => todo.completed === true));
        break;
      }

      default:
        setSortTodos(todos);
        break;
    }
  }, [filter, todos]);

  const handleFilterChange = (newFilter: string) => {
    setfilter(newFilter);
  };

  const handleAllActive = () => {
    if (!allActive) {
      setAllActive(true);
    } else {
      setAllActive(false);
    }
  };

  const sum = todos.filter(todo => todo.completed === false);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={handleAllActive}
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {sortTodos.map(todo => {
            return (
              <TodoItems key={todo.id} todo={todo} allActive={allActive} />
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {sum.length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link ', {
                selected: filter === 'All',
              })}
              data-cy="FilterLinkAll"
              onClick={() => handleFilterChange('All')}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link ', {
                selected: filter === 'Active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => handleFilterChange('Active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link ', {
                selected: filter === 'Completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => handleFilterChange('Completed')}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          {todos.find(item => item.completed) && (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          )}
        </footer>
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button data-cy="HideErrorButton" type="button" className="delete" />
          {errorMessage}
          {/* show only one message at a time
          Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      )}
    </div>
  );
};
