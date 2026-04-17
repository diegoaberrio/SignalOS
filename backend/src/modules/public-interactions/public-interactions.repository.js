import { pool } from "../../config/db.js";

export const findSectorById = async (sectorId) => {
  const result = await pool.query(
    `SELECT id, code, name FROM sectors WHERE id = $1 AND is_active = TRUE LIMIT 1`,
    [sectorId]
  );
  return result.rows[0] || null;
};

export const findZoneById = async (zoneId) => {
  const result = await pool.query(
    `SELECT id, code, name FROM zones WHERE id = $1 AND is_active = TRUE LIMIT 1`,
    [zoneId]
  );
  return result.rows[0] || null;
};

export const findIntentionById = async (intentionId) => {
  const result = await pool.query(
    `SELECT id, code, name FROM interaction_intentions WHERE id = $1 AND is_active = TRUE LIMIT 1`,
    [intentionId]
  );
  return result.rows[0] || null;
};

export const findExistingCompany = async ({
  normalizedCompanyName,
  businessEmail = null,
  businessPhone = null,
}) => {
  const query = `
    SELECT
      id,
      company_name,
      normalized_company_name,
      business_email,
      business_phone,
      total_interactions_count,
      first_interaction_at,
      last_interaction_at
    FROM companies
    WHERE normalized_company_name = $1
       OR ($2::citext IS NOT NULL AND business_email = $2)
       OR ($3::varchar IS NOT NULL AND business_phone = $3)
    ORDER BY id ASC
    LIMIT 1
  `;

  const result = await pool.query(query, [
    normalizedCompanyName,
    businessEmail,
    businessPhone,
  ]);

  return result.rows[0] || null;
};

export const createCompany = async (client, payload) => {
  const query = `
    INSERT INTO companies (
      sector_id,
      primary_zone_id,
      company_name,
      normalized_company_name,
      website,
      business_email,
      business_phone,
      contact_person_name,
      source_status,
      company_status,
      current_intention_id,
      current_priority_score,
      current_priority_level,
      priority_reason,
      total_interactions_count,
      first_interaction_at,
      last_interaction_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      'captured', 'active', $9, $10, $11, $12, $13, NOW(), NOW()
    )
    RETURNING id
  `;

  const values = [
    payload.sector_id,
    payload.consulted_zone_id,
    payload.company_name,
    payload.normalized_company_name,
    payload.website,
    payload.business_email,
    payload.business_phone,
    payload.contact_person_name,
    payload.intention_id,
    payload.priority_score,
    payload.priority_level,
    payload.priority_reason,
    1,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const updateExistingCompany = async (client, companyId, payload) => {
  const query = `
    UPDATE companies
    SET
      sector_id = COALESCE($2, sector_id),
      primary_zone_id = COALESCE($3, primary_zone_id),
      company_name = COALESCE($4, company_name),
      normalized_company_name = COALESCE($5, normalized_company_name),
      website = COALESCE($6, website),
      business_email = COALESCE($7, business_email),
      business_phone = COALESCE($8, business_phone),
      contact_person_name = COALESCE($9, contact_person_name),
      current_intention_id = COALESCE($10, current_intention_id),
      current_priority_score = $11,
      current_priority_level = $12,
      priority_reason = $13,
      total_interactions_count = total_interactions_count + 1,
      last_interaction_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, total_interactions_count
  `;

  const values = [
    companyId,
    payload.sector_id,
    payload.consulted_zone_id,
    payload.company_name,
    payload.normalized_company_name,
    payload.website,
    payload.business_email,
    payload.business_phone,
    payload.contact_person_name,
    payload.intention_id,
    payload.priority_score,
    payload.priority_level,
    payload.priority_reason,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const createPublicInteraction = async (client, payload) => {
  const query = `
    INSERT INTO public_interactions (
      company_id,
      intention_id,
      sector_id,
      consulted_zone_id,
      representative_name,
      representative_email,
      representative_phone,
      source_channel,
      source_referrer,
      source_campaign,
      language_code,
      device_type,
      ip_address,
      user_agent,
      consent_accepted,
      consent_accepted_at,
      interaction_status,
      session_identifier,
      depth_score,
      repetition_count,
      priority_score_snapshot,
      priority_level_snapshot,
      submitted_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, TRUE, NOW(), 'submitted', $15, $16, $17, $18, $19, NOW()
    )
    RETURNING id
  `;

  const values = [
    payload.company_id,
    payload.intention_id,
    payload.sector_id,
    payload.consulted_zone_id,
    payload.representative_name,
    payload.representative_email,
    payload.representative_phone,
    payload.source_channel,
    payload.source_referrer,
    payload.source_campaign,
    payload.language_code,
    payload.device_type,
    payload.ip_address,
    payload.user_agent,
    payload.session_identifier,
    payload.depth_score,
    payload.repetition_count,
    payload.priority_score,
    payload.priority_level,
  ];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const updateCompanyCreatedFromInteraction = async (
  client,
  companyId,
  interactionId
) => {
  await client.query(
    `
      UPDATE companies
      SET created_from_interaction_id = COALESCE(created_from_interaction_id, $2),
          updated_at = NOW()
      WHERE id = $1
    `,
    [companyId, interactionId]
  );
};

export const createInteractionEvents = async (client, interactionId, events = []) => {
  if (!events.length) return;

  const baseQuery = `
    INSERT INTO interaction_events (
      interaction_id,
      event_type,
      event_value,
      event_order,
      occurred_at
    )
    VALUES
  `;

  const values = [];
  const placeholders = [];

  events.forEach((event, index) => {
    const offset = index * 4;

    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, NOW())`
    );

    values.push(
      interactionId,
      event.event_type,
      event.event_value || null,
      event.event_order || index + 1
    );
  });

  const query = `${baseQuery} ${placeholders.join(", ")}`;
  await client.query(query, values);
};

export const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};