import {
  findCompanies,
  countCompanies,
  findCompanyById,
  findCompanyInteractions,
} from "./companies.repository.js";
import {
  parsePagination,
  buildPaginationMeta,
  parseSortOrder,
} from "../../utils/pagination.js";

export const getCompanies = async (queryParams) => {
  const { page, pageSize, limit, offset } = parsePagination(queryParams);

  const filters = {
    search: queryParams.search?.trim() || null,
    sectorId: queryParams.sector_id ? Number(queryParams.sector_id) : null,
    zoneId: queryParams.zone_id ? Number(queryParams.zone_id) : null,
    priorityLevel: queryParams.priority_level || null,
    companyStatus: queryParams.company_status || null,
    sortBy: queryParams.sort_by || "last_interaction_at",
    sortOrder: parseSortOrder(queryParams.sort_order),
    limit,
    offset,
  };

  const [items, totalItems] = await Promise.all([
    findCompanies(filters),
    countCompanies(filters),
  ]);

  const data = items.map((item) => ({
    id: Number(item.id),
    company_name: item.company_name,
    sector: item.sector_id
      ? {
          id: Number(item.sector_id),
          name: item.sector_name,
        }
      : null,
    zone: item.zone_id
      ? {
          id: Number(item.zone_id),
          name: item.zone_name,
        }
      : null,
    current_intention: item.intention_id
      ? {
          id: Number(item.intention_id),
          name: item.intention_name,
        }
      : null,
    priority: {
      score: Number(item.current_priority_score),
      level: item.current_priority_level,
    },
    total_interactions_count: Number(item.total_interactions_count),
    first_interaction_at: item.first_interaction_at,
    last_interaction_at: item.last_interaction_at,
    company_status: item.company_status,
  }));

  const meta = {
    ...buildPaginationMeta({
      page,
      pageSize,
      totalItems,
    }),
    filters: {
      search: filters.search,
      sector_id: filters.sectorId,
      zone_id: filters.zoneId,
      priority_level: filters.priorityLevel,
      company_status: filters.companyStatus,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder,
    },
  };

  return { data, meta };
};

export const getCompanyById = async (companyId) => {
  const company = await findCompanyById(companyId);

  if (!company) {
    const error = new Error("Company not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: Number(company.id),
    company_name: company.company_name,
    normalized_company_name: company.normalized_company_name,
    website: company.website,
    business_email: company.business_email,
    business_phone: company.business_phone,
    contact_person_name: company.contact_person_name,
    sector: company.sector_id
      ? {
          id: Number(company.sector_id),
          name: company.sector_name,
        }
      : null,
    primary_zone: company.zone_id
      ? {
          id: Number(company.zone_id),
          name: company.zone_name,
        }
      : null,
    current_intention: company.intention_id
      ? {
          id: Number(company.intention_id),
          name: company.intention_name,
        }
      : null,
    priority: {
      score: Number(company.current_priority_score),
      level: company.current_priority_level,
      reason: company.priority_reason,
    },
    source_status: company.source_status,
    company_status: company.company_status,
    total_interactions_count: Number(company.total_interactions_count),
    first_interaction_at: company.first_interaction_at,
    last_interaction_at: company.last_interaction_at,
    created_at: company.created_at,
    updated_at: company.updated_at,
  };
};

export const getCompanyInteractions = async (companyId) => {
  const company = await findCompanyById(companyId);

  if (!company) {
    const error = new Error("Company not found");
    error.statusCode = 404;
    throw error;
  }

  const interactions = await findCompanyInteractions(companyId);

  return interactions.map((item) => ({
    id: Number(item.id),
    representative_name: item.representative_name,
    representative_email: item.representative_email,
    representative_phone: item.representative_phone,
    source_channel: item.source_channel,
    device_type: item.device_type,
    interaction_status: item.interaction_status,
    submitted_at: item.submitted_at,
    consulted_zone: item.consulted_zone_id
      ? {
          id: Number(item.consulted_zone_id),
          name: item.consulted_zone_name,
        }
      : null,
    intention: item.intention_id
      ? {
          id: Number(item.intention_id),
          name: item.intention_name,
        }
      : null,
    priority_snapshot: {
      score: Number(item.priority_score_snapshot),
      level: item.priority_level_snapshot,
    },
    metadata: {
      source_referrer: item.source_referrer,
      source_campaign: item.source_campaign,
      language_code: item.language_code,
      session_identifier: item.session_identifier,
      ip_address: item.ip_address,
      user_agent: item.user_agent,
    },
  }));
};