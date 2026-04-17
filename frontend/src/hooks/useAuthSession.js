import { useEffect, useState } from 'react';
import { get_current_user, login_user, logout_user } from '../services/authService';

function useAuthSession() {
  const [user, setUser] = useState(null);
  const [is_checking_session, setIsCheckingSession] = useState(true);
  const [is_logging_in, setIsLoggingIn] = useState(false);
  const [auth_error, setAuthError] = useState('');

  async function check_session() {
    setIsCheckingSession(true);
    setAuthError('');

    const response = await get_current_user();

    if (response.ok) {
      setUser(response.data);
    } else {
      setUser(null);
    }

    setIsCheckingSession(false);
  }

  async function sign_in(credentials) {
    setIsLoggingIn(true);
    setAuthError('');

    const login_response = await login_user(credentials);

    if (!login_response.ok) {
      setAuthError(login_response.error?.message || 'No se pudo iniciar sesión.');
      setIsLoggingIn(false);
      return { ok: false, error: login_response.error };
    }

    const me_response = await get_current_user();

    if (!me_response.ok) {
      setAuthError(me_response.error?.message || 'No se pudo recuperar la sesión.');
      setUser(null);
      setIsLoggingIn(false);
      return { ok: false, error: me_response.error };
    }

    setUser(me_response.data);
    setIsLoggingIn(false);

    return { ok: true, data: me_response.data };
  }

  function sign_out() {
    logout_user();
    setUser(null);
    setAuthError('');
  }

  useEffect(() => {
    check_session();
  }, []);

  return {
    user,
    is_checking_session,
    is_logging_in,
    auth_error,
    sign_in,
    sign_out,
    check_session,
  };
}

export default useAuthSession;