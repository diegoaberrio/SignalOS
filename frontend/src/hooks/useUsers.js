import { useCallback, useEffect, useState } from 'react';
import { get_users } from '../services/userService';

function useUsers(initial_params = {}) {
  const [users, setUsers] = useState([]);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');
  const [query_params, setQueryParams] = useState(initial_params);

  const load_users = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const response = await get_users(query_params);

    if (response.ok) {
      setUsers(Array.isArray(response.data) ? response.data : []);
    } else {
      setUsers([]);
      setErrorMessage(response.error?.message || 'No se pudo cargar el listado de usuarios.');
    }

    setIsLoading(false);
  }, [query_params]);

  useEffect(() => {
    load_users();
  }, [load_users]);

  function update_query_params(next_params) {
    setQueryParams((previous) => ({
      ...previous,
      ...next_params,
    }));
  }

  return {
    users,
    is_loading,
    error_message,
    query_params,
    reload_users: load_users,
    update_query_params,
  };
}

export default useUsers;