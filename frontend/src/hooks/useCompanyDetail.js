import { useCallback, useEffect, useState } from 'react';
import { get_company_by_id } from '../services/companyService';

function useCompanyDetail(company_id) {
  const [company, setCompany] = useState(null);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');

  const load_company = useCallback(async () => {
    if (!company_id) {
      setCompany(null);
      setErrorMessage('No se recibió un identificador de empresa válido.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const response = await get_company_by_id(company_id);

    if (response.ok) {
      setCompany(response.data ?? null);
    } else {
      setCompany(null);
      setErrorMessage(response.error?.message || 'No se pudo cargar la ficha de empresa.');
    }

    setIsLoading(false);
  }, [company_id]);

  useEffect(() => {
    load_company();
  }, [load_company]);

  return {
    company,
    is_loading,
    error_message,
    reload_company: load_company,
  };
}

export default useCompanyDetail;