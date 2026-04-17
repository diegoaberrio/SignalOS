import { useCallback, useEffect, useState } from 'react';
import { get_companies } from '../services/companyService';

function useCompanies(initial_params = {}) {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');

  const [query_params, setQueryParams] = useState({
    page: 1,
    page_size: 20,
    ...initial_params,
  });

  const load_companies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const response = await get_companies(query_params);

    if (response.ok) {
      setCompanies(Array.isArray(response.data) ? response.data : []);
      setPagination(response.meta?.pagination ?? null);
      setFilters(response.meta?.filters ?? null);
    } else {
      setCompanies([]);
      setPagination(null);
      setFilters(null);
      setErrorMessage(response.error?.message || 'No se pudo cargar el listado de empresas.');
    }

    setIsLoading(false);
  }, [query_params]);

  useEffect(() => {
    load_companies();
  }, [load_companies]);

  function update_query_params(next_params) {
    setQueryParams({
      page: 1,
      page_size: 20,
      ...next_params,
    });
  }

  return {
    companies,
    pagination,
    filters,
    query_params,
    is_loading,
    error_message,
    reload_companies: load_companies,
    update_query_params,
  };
}

export default useCompanies;