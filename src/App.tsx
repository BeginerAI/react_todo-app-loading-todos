/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItems';
import classNames from 'classnames';
import { ErrorNotification } from './components/ErrorNotification';

export enum FiltredValue {
  Active = 'Active',
  All = 'All',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const [sortTodos, setSortTodos] = useState(todos);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setfilter] = useState<FiltredValue>(FiltredValue.All);
  const [allActive, setAllActive] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    setDisableBtn(!todos.some(item => item.completed));
  }, [todos]);

  const SortItems = todos.filter(todo => {
    switch (filter) {
      case FiltredValue.Active:
        return !todo.completed;
      case FiltredValue.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilterChange = (newFilter: FiltredValue) => {
    setfilter(newFilter);
  };

  const handleAllActive = () => {
    setAllActive(prev => !prev);
  };

  const sum = todos.filter(todo => !todo.completed);

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
          {SortItems.map(todo => {
            return <TodoItem key={todo.id} todo={todo} allActive={allActive} />;
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
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
                onClick={() => handleFilterChange(FiltredValue.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link ', {
                  selected: filter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleFilterChange(FiltredValue.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link ', {
                  selected: filter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilterChange(FiltredValue.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={disableBtn}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification message={errorMessage} />
    </div>
  );
};
