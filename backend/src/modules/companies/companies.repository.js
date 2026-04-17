import { pool } from "../../config/db.js";

export const findCompanies = async ({
  search = null,
  sectorId = null,
  zoneId = null,
  priorityLevel = null,
  companyStatus = null,
  sortBy = "last_interaction_at",
  sortOrder = "desc",
  limit,
  offset,
}) => {
  const allowedSortFields = {
    company_name: "c.company_name",
    created_at: "c.created_at",
    last_interaction_at: "c.last_interaction_at",
    current_priority_score: "c.current_priority_score",
  };

  const safeSortBy = allowedSortFields[sortBy] || allowedSortFields.last_interaction_at;
  const safeSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT
      c.id,
      c.company_name,
      c.company_status,
      c.current_priority_score,
      c.current_priority_level,
      c.total_interactions_count,
      c.first_interaction_at,
      c.last_interaction_at,
      s.id AS sector_id,
      s.name AS sector_name,
      z.id AS zone_id,
      z.name AS zone_name,
      ii.id AS intention_id,
      ii.name AS intention_name
    FROM companies c
    LEFT JOIN sectors s ON s.id = c.sector_id
    LEFT JOIN zones z ON z.id = c.primary_zone_id
    LEFT JOIN interaction_intentions ii ON ii.id = c.current_intention_id
    WHERE 1=1
  `;

  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND c.company_name ILIKE $${paramIndex}`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (sectorId) {
    query += ` AND c.sector_id = $${paramIndex}`;
    values.push(sectorId);
    paramIndex++;
  }

  if (zoneId) {
    query += ` AND c.primary_zone_id = $${paramIndex}`;
    values.push(zoneId);
    paramIndex++;
  }

  if (priorityLevel) {
    query += ` AND c.current_priority_level = $${paramIndex}`;
    values.push(priorityLevel);
    paramIndex++;
  }

  if (companyStatus) {
    query += ` AND c.company_status = $${paramIndex}`;
    values.push(companyStatus);
    paramIndex++;
  }

  query += `
    ORDER BY ${safeSortBy} ${safeSortOrder} NULLS LAST, c.id DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

export const countCompanies = async ({
  search = null,
  sectorId = null,
  zoneId = null,
  priorityLevel = null,
  companyStatus = null,
}) => {
  let query = `
    SELECT COUNT(*)::INT AS total
    FROM companies c
    WHERE 1=1
  `;

  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND c.company_name ILIKE $${paramIndex}`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (sectorId) {
    query += ` AND c.sector_id = $${paramIndex}`;
    values.push(sectorId);
    paramIndex++;
  }

  if (zoneId) {
    query += ` AND c.primary_zone_id = $${paramIndex}`;
    values.push(zoneId);
    paramIndex++;
  }

  if (priorityLevel) {
    query += ` AND c.current_priority_level = $${paramIndex}`;
    values.push(priorityLevel);
    paramIndex++;
  }

  if (companyStatus) {
    query += ` AND c.company_status = $${paramIndex}`;
    values.push(companyStatus);
    paramIndex++;
  }

  const result = await pool.query(query, values);
  return result.rows[0]?.total || 0;
};

export const findCompanyById = async (companyId) => {
  const query = `
    SELECT
      c.id,
      c.company_name,
      c.normalized_company_name,
      c.website,
      c.business_email,
      c.business_phone,
      c.contact_person_name,
      c.source_status,
      c.company_status,
      c.current_priority_score,
      c.current_priority_level,
      c.priority_reason,
      c.total_interactions_count,
      c.first_interaction_at,
      c.last_interaction_at,
      c.created_at,
      c.updated_at,
      s.id AS sector_id,
      s.name AS sector_name,
      z.id AS zone_id,
      z.name AS zone_name,
      ii.id AS intention_id,
      ii.name AS intention_name
    FROM companies c
    LEFT JOIN sectors s ON s.id = c.sector_id
    LEFT JOIN zones z ON z.id = c.primary_zone_id
    LEFT JOIN interaction_intentions ii ON ii.id = c.current_intention_id
    WHERE c.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [companyId]);
  return result.rows[0] || null;
};

export const findCompanyInteractions = async (companyId) => {
  const query = `
    SELECT
      pi.id,
      pi.representative_name,
      pi.representative_email,
      pi.representative_phone,
      pi.source_channel,
      pi.source_referrer,
      pi.source_campaign,
      pi.language_code,
      pi.device_type,
      pi.ip_address,
      pi.user_agent,
      pi.session_identifier,
      pi.interaction_status,
      pi.priority_score_snapshot,
      pi.priority_level_snapshot,
      pi.submitted_at,
      z.id AS consulted_zone_id,
      z.name AS consulted_zone_name,
      ii.id AS intention_id,
      ii.name AS intention_name
    FROM public_interactions pi
    LEFT JOIN zones z ON z.id = pi.consulted_zone_id
    LEFT JOIN interaction_intentions ii ON ii.id = pi.intention_id
    WHERE pi.company_id = $1
    ORDER BY pi.submitted_at DESC, pi.id DESC
  `;

  const result = await pool.query(query, [companyId]);
  return result.rows;
};