function generate_session_identifier() {
  const existing = sessionStorage.getItem('signalos_public_session_identifier');

  if (existing) {
    return existing;
  }

  const created = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem('signalos_public_session_identifier', created);

  return created;
}

export function infer_device_type() {
  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function build_public_interaction_events() {
  return [
    {
      event_type: 'view_landing',
      event_value: 'interact',
      event_order: 1,
    },
    {
      event_type: 'start_flow',
      event_value: 'public-flow',
      event_order: 2,
    },
    {
      event_type: 'submit_success',
      event_value: 'public-interaction',
      event_order: 3,
    },
  ];
}

export function build_public_interaction_payload(form_data) {
  return {
    company_name: form_data.company_name.trim(),
    website: form_data.website.trim() || null,
    business_email: form_data.business_email.trim() || null,
    business_phone: form_data.business_phone.trim() || null,
    contact_person_name: form_data.contact_person_name.trim() || null,

    representative_name: form_data.representative_name.trim() || null,
    representative_email: form_data.representative_email.trim() || null,
    representative_phone: form_data.representative_phone.trim() || null,

    sector_id: Number(form_data.sector_id),
    consulted_zone_id: Number(form_data.consulted_zone_id),
    intention_id: Number(form_data.intention_id),

    source_channel: 'web',
    source_referrer: document.referrer || null,
    source_campaign: null,
    language_code: navigator.language?.slice(0, 2) || 'es',
    device_type: infer_device_type(),
    session_identifier: generate_session_identifier(),

    consent_accepted: Boolean(form_data.consent_accepted),
    events: build_public_interaction_events(),
  };
}