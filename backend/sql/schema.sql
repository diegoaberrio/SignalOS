BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;

-- =========================================================
-- 1) Función genérica para updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- 2) Catálogos base
-- =========================================================
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE client_accounts (
    id BIGSERIAL PRIMARY KEY,
    legal_name VARCHAR(200) NOT NULL,
    commercial_name VARCHAR(200),
    contact_email CITEXT,
    contact_phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_client_accounts_status
        CHECK (status IN ('active', 'inactive', 'suspended'))
);

CREATE TABLE zones (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    parent_zone_id BIGINT NULL,
    level VARCHAR(30) NOT NULL DEFAULT 'area',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_zones_parent
        FOREIGN KEY (parent_zone_id) REFERENCES zones(id) ON DELETE SET NULL,
    CONSTRAINT chk_zones_level
        CHECK (level IN ('country', 'region', 'province', 'city', 'district', 'area', 'custom'))
);

CREATE TABLE sectors (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE interaction_intentions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 3) Usuarios internos y acceso
-- =========================================================
CREATE TABLE internal_users (
    id BIGSERIAL PRIMARY KEY,
    client_account_id BIGINT NULL,
    role_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_internal_users_client_account
        FOREIGN KEY (client_account_id) REFERENCES client_accounts(id) ON DELETE SET NULL,
    CONSTRAINT fk_internal_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    CONSTRAINT chk_internal_users_status
        CHECK (status IN ('active', 'inactive', 'disabled'))
);

-- =========================================================
-- 4) Empresas captadas / fichas consolidadas
-- =========================================================
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    sector_id BIGINT NULL,
    primary_zone_id BIGINT NULL,

    company_name VARCHAR(200) NOT NULL,
    normalized_company_name VARCHAR(200) NOT NULL,
    website VARCHAR(255),
    business_email CITEXT,
    business_phone VARCHAR(30),
    contact_person_name VARCHAR(150),

    source_status VARCHAR(20) NOT NULL DEFAULT 'captured',
    company_status VARCHAR(20) NOT NULL DEFAULT 'active',

    current_intention_id BIGINT NULL,
    current_priority_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    current_priority_level VARCHAR(20) NOT NULL DEFAULT 'low',
    priority_reason TEXT,

    total_interactions_count INTEGER NOT NULL DEFAULT 0,
    first_interaction_at TIMESTAMPTZ NULL,
    last_interaction_at TIMESTAMPTZ NULL,

    created_from_interaction_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_companies_sector
        FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL,
    CONSTRAINT fk_companies_zone
        FOREIGN KEY (primary_zone_id) REFERENCES zones(id) ON DELETE SET NULL,
    CONSTRAINT fk_companies_current_intention
        FOREIGN KEY (current_intention_id) REFERENCES interaction_intentions(id) ON DELETE SET NULL,

    CONSTRAINT chk_companies_source_status
        CHECK (source_status IN ('captured', 'enriched', 'reviewed', 'archived')),
    CONSTRAINT chk_companies_company_status
        CHECK (company_status IN ('active', 'inactive', 'archived')),
    CONSTRAINT chk_companies_priority_level
        CHECK (current_priority_level IN ('low', 'medium', 'high', 'very_high')),
    CONSTRAINT chk_companies_priority_score
        CHECK (current_priority_score >= 0 AND current_priority_score <= 100),
    CONSTRAINT chk_companies_total_interactions_count
        CHECK (total_interactions_count >= 0)
);

-- =========================================================
-- 5) Interacciones públicas
-- =========================================================
CREATE TABLE public_interactions (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    intention_id BIGINT NULL,
    sector_id BIGINT NULL,
    consulted_zone_id BIGINT NULL,

    representative_name VARCHAR(150),
    representative_email CITEXT,
    representative_phone VARCHAR(30),

    source_channel VARCHAR(30) NOT NULL DEFAULT 'web',
    source_referrer TEXT,
    source_campaign VARCHAR(150),

    language_code VARCHAR(10),
    device_type VARCHAR(20),
    ip_address INET,
    user_agent TEXT,

    consent_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    consent_accepted_at TIMESTAMPTZ NULL,

    interaction_status VARCHAR(20) NOT NULL DEFAULT 'submitted',
    session_identifier VARCHAR(100),

    depth_score INTEGER NOT NULL DEFAULT 0,
    repetition_count INTEGER NOT NULL DEFAULT 1,

    priority_score_snapshot NUMERIC(5,2) NOT NULL DEFAULT 0,
    priority_level_snapshot VARCHAR(20) NOT NULL DEFAULT 'low',

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_public_interactions_company
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_public_interactions_intention
        FOREIGN KEY (intention_id) REFERENCES interaction_intentions(id) ON DELETE SET NULL,
    CONSTRAINT fk_public_interactions_sector
        FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL,
    CONSTRAINT fk_public_interactions_zone
        FOREIGN KEY (consulted_zone_id) REFERENCES zones(id) ON DELETE SET NULL,

    CONSTRAINT chk_public_interactions_source_channel
        CHECK (source_channel IN ('web', 'landing', 'campaign', 'direct', 'other')),
    CONSTRAINT chk_public_interactions_device_type
        CHECK (device_type IS NULL OR device_type IN ('desktop', 'mobile', 'tablet', 'other')),
    CONSTRAINT chk_public_interactions_status
        CHECK (interaction_status IN ('submitted', 'processed', 'discarded')),
    CONSTRAINT chk_public_interactions_depth_score
        CHECK (depth_score >= 0),
    CONSTRAINT chk_public_interactions_repetition_count
        CHECK (repetition_count >= 1),
    CONSTRAINT chk_public_interactions_priority_score
        CHECK (priority_score_snapshot >= 0 AND priority_score_snapshot <= 100),
    CONSTRAINT chk_public_interactions_priority_level
        CHECK (priority_level_snapshot IN ('low', 'medium', 'high', 'very_high')),
    CONSTRAINT chk_public_interactions_consent
        CHECK (
            (consent_accepted = TRUE AND consent_accepted_at IS NOT NULL)
            OR
            (consent_accepted = FALSE)
        )
);

-- =========================================================
-- 6) Eventos / señales básicas de interacción
-- =========================================================
CREATE TABLE interaction_events (
    id BIGSERIAL PRIMARY KEY,
    interaction_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_value VARCHAR(255),
    event_order INTEGER NOT NULL DEFAULT 1,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_interaction_events_interaction
        FOREIGN KEY (interaction_id) REFERENCES public_interactions(id) ON DELETE CASCADE,
    CONSTRAINT chk_interaction_events_order
        CHECK (event_order >= 1),
    CONSTRAINT chk_interaction_events_type
        CHECK (
            event_type IN (
                'view_landing',
                'start_flow',
                'step_completed',
                'zone_selected',
                'sector_selected',
                'intention_selected',
                'result_viewed',
                'submit_attempt',
                'submit_success',
                'repeat_visit',
                'other'
            )
        )
);

-- =========================================================
-- 7) FK diferida de companies.created_from_interaction_id
--    Se crea aquí porque public_interactions depende de companies.
-- =========================================================
ALTER TABLE companies
ADD CONSTRAINT fk_companies_created_from_interaction
FOREIGN KEY (created_from_interaction_id) REFERENCES public_interactions(id) ON DELETE SET NULL;

-- =========================================================
-- 8) Índices
-- =========================================================

-- Usuarios internos
CREATE INDEX idx_internal_users_client_account_id ON internal_users(client_account_id);
CREATE INDEX idx_internal_users_role_id ON internal_users(role_id);
CREATE INDEX idx_internal_users_status ON internal_users(status);

-- Empresas
CREATE INDEX idx_companies_sector_id ON companies(sector_id);
CREATE INDEX idx_companies_primary_zone_id ON companies(primary_zone_id);
CREATE INDEX idx_companies_current_intention_id ON companies(current_intention_id);
CREATE INDEX idx_companies_priority_level ON companies(current_priority_level);
CREATE INDEX idx_companies_priority_score ON companies(current_priority_score DESC);
CREATE INDEX idx_companies_last_interaction_at ON companies(last_interaction_at DESC);
CREATE INDEX idx_companies_source_status ON companies(source_status);
CREATE INDEX idx_companies_company_status ON companies(company_status);
CREATE INDEX idx_companies_normalized_company_name ON companies(normalized_company_name);
CREATE INDEX idx_companies_business_email ON companies(business_email);
CREATE INDEX idx_companies_business_phone ON companies(business_phone);

-- Interacciones públicas
CREATE INDEX idx_public_interactions_company_id ON public_interactions(company_id);
CREATE INDEX idx_public_interactions_intention_id ON public_interactions(intention_id);
CREATE INDEX idx_public_interactions_sector_id ON public_interactions(sector_id);
CREATE INDEX idx_public_interactions_consulted_zone_id ON public_interactions(consulted_zone_id);
CREATE INDEX idx_public_interactions_submitted_at ON public_interactions(submitted_at DESC);
CREATE INDEX idx_public_interactions_source_channel ON public_interactions(source_channel);
CREATE INDEX idx_public_interactions_interaction_status ON public_interactions(interaction_status);
CREATE INDEX idx_public_interactions_session_identifier ON public_interactions(session_identifier);

-- Eventos
CREATE INDEX idx_interaction_events_interaction_id ON interaction_events(interaction_id);
CREATE INDEX idx_interaction_events_event_type ON interaction_events(event_type);
CREATE INDEX idx_interaction_events_occurred_at ON interaction_events(occurred_at DESC);

-- Catálogos
CREATE INDEX idx_zones_parent_zone_id ON zones(parent_zone_id);
CREATE INDEX idx_zones_is_active ON zones(is_active);
CREATE INDEX idx_sectors_is_active ON sectors(is_active);
CREATE INDEX idx_interaction_intentions_is_active ON interaction_intentions(is_active);

-- =========================================================
-- 9) Triggers updated_at
-- =========================================================
CREATE TRIGGER trg_roles_set_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_client_accounts_set_updated_at
BEFORE UPDATE ON client_accounts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_zones_set_updated_at
BEFORE UPDATE ON zones
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_sectors_set_updated_at
BEFORE UPDATE ON sectors
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_interaction_intentions_set_updated_at
BEFORE UPDATE ON interaction_intentions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_internal_users_set_updated_at
BEFORE UPDATE ON internal_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_companies_set_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_public_interactions_set_updated_at
BEFORE UPDATE ON public_interactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;