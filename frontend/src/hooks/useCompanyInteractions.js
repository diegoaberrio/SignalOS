import { useCallback, useEffect, useState } from 'react';
import { get_company_interactions } from '../services/companyService';

function useCompanyInteractions(company_id) {
  const [interactions, setInteractions] = useState([]);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');

  const load_interactions = useCallback(async () => {
    if (!company_id) {
      setInteractions([]);
      setErrorMessage('Debes seleccionar una empresa para ver su historial de interacciones.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const response = await get_company_interactions(company_id);

    if (response.ok) {
      setInteractions(Array.isArray(response.data) ? response.data : []);
    } else {
      setInteractions([]);
      setErrorMessage(response.error?.message || 'No se pudo cargar el historial de interacciones.');
    }

    setIsLoading(false);
  }, [company_id]);

  useEffect(() => {
    load_interactions();
  }, [load_interactions]);

  return {
    interactions,
    is_loading,
    error_message,
    reload_interactions: load_interactions,
  };
}

export default useCompanyInteractions;