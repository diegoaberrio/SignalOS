import { useCallback, useEffect, useState } from 'react';
import {
  get_zones_catalog,
  get_sectors_catalog,
  get_intentions_catalog,
} from '../services/catalogService';

function usePublicCatalogs() {
  const [zones, setZones] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [intentions, setIntentions] = useState([]);
  const [is_loading, setIsLoading] = useState(true);
  const [error_message, setErrorMessage] = useState('');

  const load_catalogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const [zones_response, sectors_response, intentions_response] = await Promise.all([
      get_zones_catalog(),
      get_sectors_catalog(),
      get_intentions_catalog(),
    ]);

    if (!zones_response.ok || !sectors_response.ok || !intentions_response.ok) {
      setZones([]);
      setSectors([]);
      setIntentions([]);
      setErrorMessage('No se pudieron cargar los catálogos públicos.');
      setIsLoading(false);
      return;
    }

    setZones(Array.isArray(zones_response.data) ? zones_response.data : []);
    setSectors(Array.isArray(sectors_response.data) ? sectors_response.data : []);
    setIntentions(Array.isArray(intentions_response.data) ? intentions_response.data : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load_catalogs();
  }, [load_catalogs]);

  return {
    zones,
    sectors,
    intentions,
    is_loading,
    error_message,
    reload_catalogs: load_catalogs,
  };
}

export default usePublicCatalogs;