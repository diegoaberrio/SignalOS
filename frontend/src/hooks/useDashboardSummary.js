import { useCallback, useEffect, useState } from 'react';
import { get_dashboard_summary } from '../services/dashboardService';

function useDashboardSummary() {
  const [summary, setSummary] = useState(null);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');

  const load_summary = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const response = await get_dashboard_summary();

    if (response.ok) {
      setSummary(response.data);
    } else {
      setSummary(null);
      setErrorMessage(response.error?.message || 'No se pudo cargar el dashboard.');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    load_summary();
  }, [load_summary]);

  return {
    summary,
    is_loading,
    error_message,
    reload_summary: load_summary,
  };
}

export default useDashboardSummary;