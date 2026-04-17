import { useMemo, useState } from 'react';
import { create_public_interaction } from '../services/catalogService';
import { build_public_interaction_payload } from '../utils/publicInteraction';

const initial_form_state = {
  company_name: '',
  website: '',
  business_email: '',
  business_phone: '',
  contact_person_name: '',
  representative_name: '',
  representative_email: '',
  representative_phone: '',
  sector_id: '',
  consulted_zone_id: '',
  intention_id: '',
  consent_accepted: false,
};

function usePublicInteractionForm() {
  const [form_data, setFormData] = useState(initial_form_state);
  const [is_submitting, setIsSubmitting] = useState(false);
  const [submit_error, setSubmitError] = useState('');
  const [submit_success, setSubmitSuccess] = useState(null);

  function update_field(name, value) {
    setSubmitError('');

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function reset_form() {
    setFormData(initial_form_state);
    setSubmitError('');
    setSubmitSuccess(null);
  }

  const has_contact_method = useMemo(() => {
    return Boolean(
      form_data.business_email.trim() ||
        form_data.business_phone.trim() ||
        form_data.representative_email.trim() ||
        form_data.representative_phone.trim()
    );
  }, [
    form_data.business_email,
    form_data.business_phone,
    form_data.representative_email,
    form_data.representative_phone,
  ]);

  const validation_error = useMemo(() => {
    if (!form_data.company_name.trim()) {
      return 'Debes indicar el nombre de la empresa.';
    }

    if (!form_data.sector_id) {
      return 'Debes seleccionar un sector.';
    }

    if (!form_data.consulted_zone_id) {
      return 'Debes seleccionar una zona.';
    }

    if (!form_data.intention_id) {
      return 'Debes seleccionar una intención.';
    }

    if (!has_contact_method) {
      return 'Debes indicar al menos un método de contacto.';
    }

    if (!form_data.consent_accepted) {
      return 'Debes aceptar el consentimiento para continuar.';
    }

    return '';
  }, [form_data, has_contact_method]);

  async function submit_form() {
    if (validation_error) {
      setSubmitError(validation_error);
      return { ok: false };
    }

    setIsSubmitting(true);
    setSubmitError('');

    const payload = build_public_interaction_payload(form_data);
    const response = await create_public_interaction(payload);

    if (!response.ok) {
      setSubmitError(response.error?.message || 'No se pudo enviar la interacción.');
      setIsSubmitting(false);
      return { ok: false, error: response.error };
    }

    setSubmitSuccess(response.data ?? {});
    setIsSubmitting(false);

    return { ok: true, data: response.data };
  }

  return {
    form_data,
    is_submitting,
    submit_error,
    submit_success,
    validation_error,
    update_field,
    submit_form,
    reset_form,
  };
}

export default usePublicInteractionForm;