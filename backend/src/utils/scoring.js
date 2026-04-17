import { PRIORITY_LEVELS } from "../config/constants.js";

const INTENTION_WEIGHTS = {
  request_contact: {
    score: 40,
    reason: "Interés directo de contacto",
  },
  request_quote: {
    score: 38,
    reason: "Solicitud de presupuesto",
  },
  search_opportunities: {
    score: 34,
    reason: "Búsqueda de oportunidades",
  },
  find_opportunity: {
    score: 30,
    reason: "Interés en oportunidades",
  },
  evaluate_supplier: {
    score: 28,
    reason: "Evaluación de proveedor",
  },
  request_advisory: {
    score: 26,
    reason: "Solicitud de asesoramiento",
  },
  search_services: {
    score: 24,
    reason: "Búsqueda de servicios",
  },
  business_support: {
    score: 22,
    reason: "Búsqueda de apoyo empresarial",
  },
  commercial_expansion: {
    score: 22,
    reason: "Interés en expansión comercial",
  },
  digitalization_interest: {
    score: 20,
    reason: "Interés en digitalización",
  },
  improve_operations: {
    score: 20,
    reason: "Interés en mejora operativa",
  },
  check_affinity: {
    score: 18,
    reason: "Evaluación de afinidad",
  },
  networking_collaboration: {
    score: 18,
    reason: "Interés en colaboración o networking",
  },
  explore_zone: {
    score: 10,
    reason: "Exploración territorial",
  },
};

const SOURCE_CHANNEL_WEIGHTS = {
  campaign: {
    score: 6,
    reason: "Interacción procedente de campaña",
  },
  landing: {
    score: 5,
    reason: "Interacción procedente de landing",
  },
  direct: {
    score: 4,
    reason: "Acceso directo",
  },
  web: {
    score: 3,
    reason: "Acceso desde web",
  },
  other: {
    score: 1,
    reason: "Canal de origen alternativo",
  },
};

const DEVICE_TYPE_WEIGHTS = {
  desktop: {
    score: 3,
    reason: "Uso desde escritorio",
  },
  mobile: {
    score: 2,
    reason: "Uso desde móvil",
  },
  tablet: {
    score: 2,
    reason: "Uso desde tablet",
  },
  other: {
    score: 1,
    reason: "Uso desde otro dispositivo",
  },
};

const SECTOR_WEIGHTS = {
  technology: {
    score: 8,
    reason: "Sector tecnología",
  },
  professional_services: {
    score: 7,
    reason: "Sector servicios profesionales",
  },
  consulting: {
    score: 7,
    reason: "Sector consultoría",
  },
  logistics: {
    score: 6,
    reason: "Sector logística",
  },
  health: {
    score: 6,
    reason: "Sector salud",
  },
  industry: {
    score: 6,
    reason: "Sector industria",
  },
  transport: {
    score: 5,
    reason: "Sector transporte",
  },
  construction: {
    score: 5,
    reason: "Sector construcción",
  },
  real_estate: {
    score: 5,
    reason: "Sector inmobiliario",
  },
  marketing_advertising: {
    score: 5,
    reason: "Sector marketing y publicidad",
  },
  education: {
    score: 4,
    reason: "Sector educación",
  },
  retail: {
    score: 4,
    reason: "Sector comercio minorista",
  },
  hospitality: {
    score: 4,
    reason: "Sector hostelería",
  },
  food_beverage: {
    score: 4,
    reason: "Sector alimentación y bebidas",
  },
};

const clampScore = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

export const calculateInitialPriority = ({
  intentionCode = null,
  sectorCode = null,
  hasBusinessEmail = false,
  hasBusinessPhone = false,
  hasRepresentativeEmail = false,
  hasRepresentativePhone = false,
  hasWebsite = false,
  sourceChannel = null,
  sourceReferrer = null,
  sourceCampaign = null,
  languageCode = null,
  deviceType = null,
  sessionIdentifier = null,
  repetitionCount = 1,
  depthScore = 0,
}) => {
  let score = 0;
  const reasons = [];

  const intentionWeight = intentionCode ? INTENTION_WEIGHTS[intentionCode] : null;
  if (intentionWeight) {
    score += intentionWeight.score;
    reasons.push(intentionWeight.reason);
  }

  const sectorWeight = sectorCode ? SECTOR_WEIGHTS[sectorCode] : null;
  if (sectorWeight) {
    score += sectorWeight.score;
    reasons.push(sectorWeight.reason);
  }

  const sourceChannelWeight = sourceChannel
    ? SOURCE_CHANNEL_WEIGHTS[sourceChannel]
    : null;
  if (sourceChannelWeight) {
    score += sourceChannelWeight.score;
    reasons.push(sourceChannelWeight.reason);
  }

  const deviceTypeWeight = deviceType ? DEVICE_TYPE_WEIGHTS[deviceType] : null;
  if (deviceTypeWeight) {
    score += deviceTypeWeight.score;
    reasons.push(deviceTypeWeight.reason);
  }

  if (hasBusinessEmail) {
    score += 10;
    reasons.push("Correo empresarial informado");
  }

  if (hasBusinessPhone) {
    score += 10;
    reasons.push("Teléfono empresarial informado");
  }

  if (hasRepresentativeEmail) {
    score += 6;
    reasons.push("Correo del representante informado");
  }

  if (hasRepresentativePhone) {
    score += 6;
    reasons.push("Teléfono del representante informado");
  }

  if (hasWebsite) {
    score += 8;
    reasons.push("Sitio web informado");
  }

  if (sourceReferrer) {
    score += 3;
    reasons.push("Origen de referencia disponible");
  }

  if (sourceCampaign) {
    score += 4;
    reasons.push("Campaña identificada");
  }

  if (languageCode) {
    score += 1;
    reasons.push("Idioma detectado");
  }

  if (sessionIdentifier) {
    score += 2;
    reasons.push("Sesión identificada");
  }

  if (repetitionCount >= 3) {
    score += 12;
    reasons.push("Patrón de interacción repetida");
  } else if (repetitionCount >= 2) {
    score += 8;
    reasons.push("Interacción repetida");
  }

  if (depthScore >= 5) {
    score += 12;
    reasons.push("Interacción con profundidad muy alta");
  } else if (depthScore >= 3) {
    score += 8;
    reasons.push("Interacción con profundidad alta");
  } else if (depthScore >= 1) {
    score += 4;
    reasons.push("Interacción con cierta profundidad");
  }

  score = clampScore(score);

  let level = PRIORITY_LEVELS.LOW;

  if (score >= 80) {
    level = PRIORITY_LEVELS.VERY_HIGH;
  } else if (score >= 60) {
    level = PRIORITY_LEVELS.HIGH;
  } else if (score >= 30) {
    level = PRIORITY_LEVELS.MEDIUM;
  }

  return {
    score,
    level,
    reason: reasons.join(". "),
  };
};