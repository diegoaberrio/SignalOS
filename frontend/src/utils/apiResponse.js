export function normalize_success_response(response) {
  return {
    ok: true,
    status: response.status,
    data: response.data?.data ?? response.data,
    meta: response.data?.meta ?? null,
    pagination: response.data?.pagination ?? null,
    error: null,
  };
}

export function normalize_error_response(error) {
  const status = error?.response?.status ?? 500;
  const response_data = error?.response?.data ?? null;

  return {
    ok: false,
    status,
    data: null,
    meta: null,
    pagination: null,
    error: {
      message:
        response_data?.message ||
        response_data?.error ||
        error.message ||
        'Ha ocurrido un error inesperado.',
      details: response_data?.details ?? null,
      raw: response_data,
    },
  };
}