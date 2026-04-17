import { normalizeCompanyName } from "../../utils/normalize.js";
import { calculateInitialPriority } from "../../utils/scoring.js";
import {
  findSectorById,
  findZoneById,
  findIntentionById,
  findExistingCompany,
  createCompany,
  updateExistingCompany,
  createPublicInteraction,
  updateCompanyCreatedFromInteraction,
  createInteractionEvents,
  withTransaction,
} from "./public-interactions.repository.js";

export const submitPublicInteraction = async (data) => {
  const [sector, zone, intention] = await Promise.all([
    findSectorById(data.sector_id),
    findZoneById(data.consulted_zone_id),
    findIntentionById(data.intention_id),
  ]);

  if (!sector) {
    const error = new Error("Selected sector does not exist");
    error.statusCode = 400;
    error.errors = [
      {
        field: "sector_id",
        code: "INVALID_REFERENCE",
        message: "Selected sector does not exist",
      },
    ];
    throw error;
  }

  if (!zone) {
    const error = new Error("Selected zone does not exist");
    error.statusCode = 400;
    error.errors = [
      {
        field: "consulted_zone_id",
        code: "INVALID_REFERENCE",
        message: "Selected zone does not exist",
      },
    ];
    throw error;
  }

  if (!intention) {
    const error = new Error("Selected intention does not exist");
    error.statusCode = 400;
    error.errors = [
      {
        field: "intention_id",
        code: "INVALID_REFERENCE",
        message: "Selected intention does not exist",
      },
    ];
    throw error;
  }

  const normalizedCompanyName = normalizeCompanyName(data.company_name);

  const depthScore = Array.isArray(data.events) ? data.events.length : 0;
  const repetitionCount = 1;

  const priority = calculateInitialPriority({
    intentionCode: intention.code,
    sectorCode: sector.code,
    hasBusinessEmail: !!data.business_email,
    hasBusinessPhone: !!data.business_phone,
    hasRepresentativeEmail: !!data.representative_email,
    hasRepresentativePhone: !!data.representative_phone,
    hasWebsite: !!data.website,
    sourceChannel: data.source_channel || null,
    sourceReferrer: data.source_referrer || null,
    sourceCampaign: data.source_campaign || null,
    languageCode: data.language_code || null,
    deviceType: data.device_type || null,
    sessionIdentifier: data.session_identifier || null,
    repetitionCount,
    depthScore,
  });

  const existingCompany = await findExistingCompany({
    normalizedCompanyName,
    businessEmail: data.business_email || null,
    businessPhone: data.business_phone || null,
  });

  return await withTransaction(async (client) => {
    let companyId;
    let isNewCompany = false;

    const basePayload = {
      ...data,
      normalized_company_name: normalizedCompanyName,
      priority_score: priority.score,
      priority_level: priority.level,
      priority_reason: priority.reason,
    };

    if (existingCompany) {
      const updatedCompany = await updateExistingCompany(
        client,
        existingCompany.id,
        basePayload
      );
      companyId = updatedCompany.id;
    } else {
      const createdCompany = await createCompany(client, basePayload);
      companyId = createdCompany.id;
      isNewCompany = true;
    }

    const createdInteraction = await createPublicInteraction(client, {
      ...basePayload,
      company_id: companyId,
      depth_score: depthScore,
      repetition_count: repetitionCount,
    });

    await updateCompanyCreatedFromInteraction(
      client,
      companyId,
      createdInteraction.id
    );

    if (Array.isArray(data.events) && data.events.length > 0) {
      await createInteractionEvents(client, createdInteraction.id, data.events);
    }

    return {
      interaction_id: Number(createdInteraction.id),
      company_id: Number(companyId),
      company_action: isNewCompany ? "created" : "updated",
      priority: {
        score: priority.score,
        level: priority.level,
        reason: priority.reason,
      },
    };
  });
};
