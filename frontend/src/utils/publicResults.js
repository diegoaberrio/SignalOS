function format_label(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function get_priority_copy(priority_level) {
  const map = {
    very_high: {
      title: 'Encaje comercial muy alto',
      description:
        'Tu perfil encaja muy bien con señales de interés de esta zona y merece seguimiento prioritario.',
      intensity: 'Alta',
      recommendation: 'Solicita validación comercial y activa coincidencias ampliadas.',
    },
    high: {
      title: 'Encaje comercial alto',
      description:
        'Hay una oportunidad clara de relación o visibilidad comercial en el entorno consultado.',
      intensity: 'Media-Alta',
      recommendation: 'Conviene revisar coincidencias relacionadas y próximos pasos.',
    },
    medium: {
      title: 'Encaje comercial medio',
      description:
        'Existe señal de interés útil, aunque todavía necesita más contexto o validación.',
      intensity: 'Media',
      recommendation: 'Explora coincidencias y refuerza la información de contacto.',
    },
    low: {
      title: 'Encaje comercial inicial',
      description:
        'Hemos detectado una señal temprana. Aún hay poco contexto, pero sí base para explorar.',
      intensity: 'Baja',
      recommendation: 'Amplía información y consulta perfiles relacionados.',
    },
  };

  return (
    map[priority_level] || {
      title: 'Encaje detectado',
      description:
        'Se ha generado una señal comercial inicial a partir de tu interacción.',
      intensity: 'Media',
      recommendation: 'Continúa con la revisión de coincidencias sugeridas.',
    }
  );
}

function get_related_sectors_by_sector_name(sector_name) {
  const sector_map = {
    Retail: ['Professional Services', 'Logistics', 'Hospitality'],
    Hospitality: ['Retail', 'Professional Services', 'Logistics'],
    Logistics: ['Retail', 'Professional Services', 'Hospitality'],
    'Professional Services': ['Retail', 'Logistics', 'Hospitality'],
  };

  return sector_map[sector_name] || ['Professional Services', 'Retail', 'Logistics'];
}

function get_relation_type_by_intention(intention_name) {
  if (!intention_name) return 'Oportunidad relacionada';

  const normalized = intention_name.toLowerCase();

  if (normalized.includes('contact')) return 'Colaboración comercial';
  if (normalized.includes('oportunidad')) return 'Oportunidad complementaria';
  if (normalized.includes('zona')) return 'Sinergia territorial';

  return 'Relación sugerida';
}

function get_base_zone_variants(zone_name) {
  if (!zone_name) return ['Guadalajara', 'Madrid', 'Toledo'];

  const nearby = {
    Guadalajara: ['Guadalajara', 'Madrid', 'Toledo'],
    Madrid: ['Madrid', 'Guadalajara', 'Toledo'],
    Toledo: ['Toledo', 'Madrid', 'Guadalajara'],
  };

  return nearby[zone_name] || [zone_name, 'Madrid', 'Guadalajara'];
}

function build_match_previews({
  priority_level,
  company_action,
  sector_name,
  zone_name,
  intention_name,
}) {
  const related_sectors = [sector_name, ...get_related_sectors_by_sector_name(sector_name)].filter(Boolean);
  const zones = get_base_zone_variants(zone_name);
  const relation_type = get_relation_type_by_intention(intention_name);

  const base_scores = {
    very_high: [91, 86, 81, 77],
    high: [84, 79, 74, 70],
    medium: [72, 68, 63, 59],
    low: [61, 57, 53, 49],
  };

  const scores = base_scores[priority_level] || base_scores.medium;

  const base = [
    {
      id: 'A-204',
      sector: related_sectors[0] || 'Professional Services',
      zone: zones[0],
      compatibility: scores[0],
      relation_type,
    },
    {
      id: 'B-119',
      sector: related_sectors[1] || 'Retail',
      zone: zones[0],
      compatibility: scores[1],
      relation_type: company_action === 'updated' ? 'Seguimiento de oportunidad' : relation_type,
    },
    {
      id: 'C-331',
      sector: related_sectors[2] || 'Logistics',
      zone: zones[1],
      compatibility: scores[2],
      relation_type: 'Sinergia territorial',
    },
    {
      id: 'D-487',
      sector: related_sectors[3] || 'Hospitality',
      zone: zones[2],
      compatibility: scores[3],
      relation_type: 'Visibilidad local',
    },
  ];

  return base;
}

export function build_public_result_model({ submit_success, form_data }) {
  const priority = submit_success?.priority || {};
  const priority_level = priority.level || 'medium';
  const priority_score = priority.score ?? '—';
  const priority_reason = priority.reason || null;
  const copy = get_priority_copy(priority_level);

  const sector_name = form_data?.sector_name || '';
  const zone_name = form_data?.zone_name || '';
  const intention_name = form_data?.intention_name || '';

  const estimated_matches =
    priority_level === 'very_high'
      ? 14
      : priority_level === 'high'
        ? 9
        : priority_level === 'medium'
          ? 5
          : 3;

  const compatible_profiles =
    priority_level === 'very_high'
      ? 4
      : priority_level === 'high'
        ? 3
        : priority_level === 'medium'
          ? 2
          : 1;

  return {
    hero: {
      title: copy.title,
      description: copy.description,
      priority_level: format_label(priority_level),
      priority_score,
      priority_reason,
      company_action: format_label(submit_success?.company_action || 'processed'),
      sector_name,
      zone_name,
      intention_name,
    },
    insights: [
      {
        label: 'Intensidad de oportunidad',
        value: copy.intensity,
      },
      {
        label: 'Perfiles compatibles detectados',
        value: compatible_profiles,
      },
      {
        label: 'Coincidencias estimadas en entorno relacionado',
        value: estimated_matches,
      },
      {
        label: 'Siguiente paso sugerido',
        value: copy.recommendation,
      },
    ],
    matches: build_match_previews({
      priority_level,
      company_action: submit_success?.company_action,
      sector_name,
      zone_name,
      intention_name,
    }),
    cta: {
      title: '¿Quieres seguir avanzando?',
      description:
        'Puedes revisar otra coincidencia sugerida o marcar tu interés para revisión comercial.',
      primary_label: 'Solicitar revisión comercial',
      secondary_label: 'Ver otra coincidencia',
    },
  };
}