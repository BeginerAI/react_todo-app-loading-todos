import { useLayoutEffect, useState } from 'react';

interface Props {
  message: string;
}

export const ErrorNotification: React.FC<Props> = ({ message }) => {
  const [stateError, setStateError] = useState(false);

  useLayoutEffect(() => {
    if (message) {
      setStateError(true);
    }
  }, [message]);

  const hideNotification = () => {
    setStateError(false);
  };

  if (!stateError) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideNotification}
      />
      {message}
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
  );
};
