import {
  findActiveZones,
  findActiveSectors,
  findActiveIntentions,
} from "./catalog.repository.js";

export const getZones = async ({ level, parentZoneId }) => {
  const zones = await findActiveZones({ level, parentZoneId });

  return zones.map((zone) => ({
    id: Number(zone.id),
    code: zone.code,
    name: zone.name,
    parent_zone_id: zone.parent_zone_id ? Number(zone.parent_zone_id) : null,
    level: zone.level,
    is_active: zone.is_active,
  }));
};

export const getSectors = async () => {
  const sectors = await findActiveSectors();

  return sectors.map((sector) => ({
    id: Number(sector.id),
    code: sector.code,
    name: sector.name,
    description: sector.description,
    is_active: sector.is_active,
  }));
};

export const getIntentions = async () => {
  const intentions = await findActiveIntentions();

  return intentions.map((intention) => ({
    id: Number(intention.id),
    code: intention.code,
    name: intention.name,
    description: intention.description,
    is_active: intention.is_active,
  }));
};