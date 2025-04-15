/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';

interface Prop {
  todo: Todo;
}

export const TodoItems: React.FC<Prop> = ({ todo }) => {
  useEffect(() => {}, [todo.completed]);

  const [isChecked, setIsChecked] = useState(false);

  // Функція для обробки кліку на чекбокс
  const handleCheckboxChange = () => {
    if (!isChecked) {
      setIsChecked(true); // Змінюємо стан
    } else {
      setIsChecked(false); // Змінюємо стан
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: isChecked })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {false && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}
    </>
  );
};
