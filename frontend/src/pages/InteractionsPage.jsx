import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  CircleGauge,
  Globe,
  Mail,
  MapPinned,
  MonitorSmartphone,
  Phone,
  Radar,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import useCompanyInteractions from '../hooks/useCompanyInteractions';
import StatusCard from '../components/common/StatusCard';

function format_label(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function format_datetime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function MetadataRow({ label, value, icon }) {
  return (
    <div className="interaction-metadata__item interactions-page__metadata-item interactions-page__metadata-item--responsive">
      <span className="interaction-metadata__label interactions-page__metadata-label interactions-page__metadata-label--responsive">
        {icon ? (
          <span className="interactions-page__metadata-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </span>
      <strong className="interaction-metadata__value">{value || '—'}</strong>
    </div>
  );
}

function InteractionCard({ interaction, company_id }) {
  const priority_level = interaction.priority_snapshot?.level || 'default';
  const priority_score = interaction.priority_snapshot?.score ?? '—';
  const metadata = interaction.metadata || {};

  return (
    <article className="interaction-card interaction-card--enhanced interaction-card--wow interaction-card--responsive">
      <div className="interaction-card__top interaction-card__top--responsive">
        <div className="interaction-card__identity interaction-card__identity--responsive">
          <div className="interaction-card__headline interaction-card__headline--responsive">
            <div className="interaction-card__headline-copy interaction-card__headline-copy--responsive">
              <div className="interaction-card__title-row interaction-card__title-row--responsive">
                <span className="interaction-card__title-icon" aria-hidden="true">
                  <Radar size={16} />
                </span>
                <h3 className="interaction-card__title">
                  Interacción #{interaction.id}
                </h3>
              </div>

              <p className="interaction-card__summary">
                {interaction.representative_name || 'Representante no identificado'} ·{' '}
                {format_datetime(interaction.submitted_at)}
              </p>
            </div>

            <div
              className="interaction-card__score-block interaction-card__score-block--wow interaction-card__score-block--responsive"
              aria-label={`Score ${priority_score}`}
            >
              <div className="interaction-card__score-top interaction-card__score-top--responsive">
                <span className="interaction-card__score-icon" aria-hidden="true">
                  <Sparkles size={14} />
                </span>
                <span className="interaction-card__score-label">Score</span>
              </div>
              <strong className="interaction-card__score-value">{priority_score}</strong>
            </div>
          </div>

          <div className="company-card__badges interaction-card__badges--wow interaction-card__badges--responsive">
            <span className={`priority-pill priority-pill--${priority_level}`}>
              <CircleGauge size={13} aria-hidden="true" />
              {format_label(priority_level)}
            </span>

            <span className="neutral-pill">
              <ShieldCheck size={13} aria-hidden="true" />
              {format_label(interaction.interaction_status || 'unknown')}
            </span>

            <span className="neutral-pill">
              <Globe size={13} aria-hidden="true" />
              {format_label(interaction.source_channel)}
            </span>
          </div>
        </div>

        <Link
          to={`/app/companies/${company_id}`}
          className="secondary-button interaction-card__action interaction-card__action--responsive"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Ver empresa
        </Link>
      </div>

      <div className="interaction-card__grid interaction-card__grid--wow interaction-card__grid--responsive">
        <div className="interaction-card__meta-item interaction-card__meta-item--highlight interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <UserRound size={13} aria-hidden="true" />
            Representante
          </span>
          <strong>{interaction.representative_name || '—'}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <Mail size={13} aria-hidden="true" />
            Email
          </span>
          <strong>{interaction.representative_email || '—'}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <Phone size={13} aria-hidden="true" />
            Teléfono
          </span>
          <strong>{interaction.representative_phone || '—'}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <Globe size={13} aria-hidden="true" />
            Canal
          </span>
          <strong>{format_label(interaction.source_channel)}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <MonitorSmartphone size={13} aria-hidden="true" />
            Dispositivo
          </span>
          <strong>{format_label(interaction.device_type || 'unknown')}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <MapPinned size={13} aria-hidden="true" />
            Zona consultada
          </span>
          <strong>{interaction.consulted_zone?.name || '—'}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <Target size={13} aria-hidden="true" />
            Intención
          </span>
          <strong>{interaction.intention?.name || '—'}</strong>
        </div>

        <div className="interaction-card__meta-item interaction-card__meta-item--wow interaction-card__meta-item--responsive">
          <span className="interaction-card__meta-label">
            <CalendarClock size={13} aria-hidden="true" />
            Enviado
          </span>
          <strong>{format_datetime(interaction.submitted_at)}</strong>
        </div>
      </div>

      <details className="interaction-metadata interactions-page__metadata-panel interactions-page__metadata-panel--responsive">
        <summary className="interaction-metadata__summary interactions-page__metadata-summary interactions-page__metadata-summary--responsive">
          Ver metadatos de captura
        </summary>

        <div className="interaction-metadata__grid interaction-metadata__grid--responsive">
          <MetadataRow
            label="Referrer"
            value={metadata.source_referrer}
            icon={<Globe size={13} />}
          />
          <MetadataRow
            label="Campaign"
            value={metadata.source_campaign}
            icon={<Sparkles size={13} />}
          />
          <MetadataRow
            label="Language"
            value={metadata.language_code}
            icon={<Globe size={13} />}
          />
          <MetadataRow
            label="Session ID"
            value={metadata.session_identifier}
            icon={<ShieldCheck size={13} />}
          />
          <MetadataRow
            label="IP"
            value={metadata.ip_address}
            icon={<MonitorSmartphone size={13} />}
          />
          <MetadataRow
            label="User Agent"
            value={metadata.user_agent}
            icon={<Radar size={13} />}
          />
        </div>
      </details>
    </article>
  );
}

function InteractionsPage() {
  const [search_params] = useSearchParams();
  const company_id = search_params.get('company_id');

  const {
    interactions,
    is_loading,
    error_message,
    reload_interactions,
  } = useCompanyInteractions(company_id);

  if (is_loading) {
    return (
      <section className="page-section interactions-page interactions-page--responsive">
        <StatusCard
          title="Cargando historial"
          message="Estamos obteniendo las interacciones reales de la empresa."
          variant="loading"
        />
      </section>
    );
  }

  if (error_message) {
    return (
      <section className="page-section interactions-page interactions-page--responsive">
        <StatusCard
          title="No se pudo cargar el historial"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_interactions}
        />
      </section>
    );
  }

  return (
    <section className="page-section interactions-page interactions-page--responsive">
      <div className="dashboard-header interactions-page__hero interactions-page__hero--enhanced interactions-page__hero--responsive">
        <div className="interactions-page__hero-copy interactions-page__hero-copy--responsive">
          <span className="section-chip interactions-page__hero-chip interactions-page__hero-chip--responsive">
            <Radar size={14} aria-hidden="true" />
            <span>Historial</span>
          </span>

          <h1 className="page-title">Interacciones de empresa</h1>
          <p className="page-description">
            Vista conectada a <strong>GET /companies/:id/interactions</strong>.
            {company_id ? ` Empresa actual: #${company_id}.` : ''}
          </p>

          <div className="company-card__badges interactions-page__hero-badges interactions-page__hero-badges--responsive">
            <span className="neutral-pill">
              <ShieldCheck size={13} aria-hidden="true" />
              Trazabilidad comercial
            </span>
            <span className="neutral-pill">
              <Sparkles size={13} aria-hidden="true" />
              Contexto capturado
            </span>
            <span className="neutral-pill">
              <CircleGauge size={13} aria-hidden="true" />
              Prioridad histórica
            </span>
          </div>
        </div>

        <div className="detail-header__actions interactions-page__actions interactions-page__actions--responsive">
          {company_id ? (
            <Link
              to={`/app/companies/${company_id}`}
              className="secondary-button interactions-page__action-secondary interactions-page__action-secondary--responsive"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver a empresa
            </Link>
          ) : null}

          <button
            type="button"
            className="button-primary interactions-page__action-primary interactions-page__action-primary--responsive"
            onClick={reload_interactions}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Actualizar
          </button>
        </div>
      </div>

      {!company_id ? (
        <StatusCard
          title="Empresa no seleccionada"
          message="Abre esta vista desde una ficha de empresa o añade ?company_id=ID a la URL."
          variant="empty"
        />
      ) : interactions.length === 0 ? (
        <StatusCard
          title="Sin interacciones disponibles"
          message="La empresa existe, pero todavía no tiene historial visible en la API."
          variant="empty"
        />
      ) : (
        <div className="interaction-list interactions-page__list interactions-page__list--responsive">
          {interactions.map((interaction) => (
            <InteractionCard
              key={interaction.id}
              interaction={interaction}
              company_id={company_id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default InteractionsPage;