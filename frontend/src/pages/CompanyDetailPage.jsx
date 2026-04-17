import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CircleGauge,
  ExternalLink,
  Flag,
  Globe,
  Mail,
  MapPinned,
  Phone,
  Radar,
  RefreshCcw,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import useCompanyDetail from '../hooks/useCompanyDetail';
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

function InfoBlock({ label, value, href, icon }) {
  return (
    <div className="detail-meta-item company-detail-page__info-block company-detail-page__info-block--responsive">
      <span className="detail-meta-label company-detail-page__info-label company-detail-page__info-label--responsive">
        {icon ? (
          <span className="company-detail-page__info-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </span>

      {href && value ? (
        <a
          href={href}
          className="detail-link company-detail-page__detail-link company-detail-page__detail-link--responsive"
          target="_blank"
          rel="noreferrer"
        >
          <span>{value}</span>
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      ) : (
        <strong className="detail-meta-value">{value || '—'}</strong>
      )}
    </div>
  );
}

function CompanyDetailPage() {
  const { id } = useParams();
  const { company, is_loading, error_message, reload_company } = useCompanyDetail(id);

  if (is_loading) {
    return (
      <section className="page-section company-detail-page company-detail-page--responsive">
        <StatusCard
          title="Cargando ficha de empresa"
          message="Estamos consultando el detalle real de la empresa desde la API."
          variant="loading"
        />
      </section>
    );
  }

  if (error_message) {
    return (
      <section className="page-section company-detail-page company-detail-page--responsive">
        <StatusCard
          title="No se pudo cargar la ficha"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_company}
        />
      </section>
    );
  }

  if (!company) {
    return (
      <section className="page-section company-detail-page company-detail-page--responsive">
        <StatusCard
          title="Empresa no disponible"
          message="No hay datos de empresa para mostrar con ese identificador."
          variant="empty"
        />
      </section>
    );
  }

  const priority_level = company.priority?.level || 'default';
  const priority_score = company.priority?.score ?? '—';
  const priority_reason = company.priority?.reason || 'Sin explicación disponible.';

  return (
    <section className="page-section company-detail-page company-detail-page--responsive">
      <div className="detail-header company-detail-page__hero company-detail-page__hero--enhanced company-detail-page__hero--responsive">
        <div className="detail-header__content company-detail-page__hero-content company-detail-page__hero-content--responsive">
          <span className="section-chip company-detail-page__hero-chip company-detail-page__hero-chip--responsive">
            <Building2 size={14} aria-hidden="true" />
            <span>Ficha de empresa</span>
          </span>

          <h1 className="page-title">{company.company_name}</h1>
          <p className="page-description">
            Perfil conectado a <strong>GET /companies/:id</strong>.
          </p>

          <div className="company-detail-page__hero-meta company-detail-page__hero-meta--responsive">
            <div className="company-card__badges company-detail-page__hero-badges company-detail-page__hero-badges--responsive">
              <span className={`priority-pill priority-pill--${priority_level}`}>
                <CircleGauge size={13} aria-hidden="true" />
                {format_label(priority_level)}
              </span>

              <span className="neutral-pill">
                <Flag size={13} aria-hidden="true" />
                {format_label(company.company_status || 'unknown')}
              </span>

              <span className="neutral-pill">
                <Radar size={13} aria-hidden="true" />
                {format_label(company.source_status || 'unknown')}
              </span>
            </div>

            <div className="company-detail-page__score-card company-detail-page__score-card--wow company-detail-page__score-card--responsive">
              <div className="company-detail-page__score-top company-detail-page__score-top--responsive">
                <span className="company-detail-page__score-icon" aria-hidden="true">
                  <Sparkles size={14} />
                </span>
                <span className="company-detail-page__score-label">Score de prioridad</span>
              </div>
              <strong className="company-detail-page__score-value">{priority_score}</strong>
            </div>
          </div>
        </div>

        <div className="detail-header__actions company-detail-page__actions company-detail-page__actions--responsive">
          <button
            type="button"
            className="button-primary company-detail-page__action-primary company-detail-page__action-primary--responsive"
            onClick={reload_company}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Actualizar
          </button>

          <Link
            to="/app/companies"
            className="secondary-button company-detail-page__action-secondary company-detail-page__action-secondary--responsive"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al listado
          </Link>

          <Link
            to={`/app/interactions?company_id=${company.id}`}
            className="secondary-button company-detail-page__action-secondary company-detail-page__action-secondary--responsive"
          >
            <Radar size={16} aria-hidden="true" />
            Ver historial
          </Link>
        </div>
      </div>

      <div className="detail-layout company-detail-page__layout company-detail-page__layout--responsive">
        <section className="detail-panel company-detail-page__panel company-detail-page__panel--enhanced company-detail-page__panel--responsive">
          <div className="dashboard-panel__header company-detail-page__panel-header company-detail-page__panel-header--responsive">
            <span className="section-chip company-detail-page__panel-chip company-detail-page__panel-chip--responsive">
              <Target size={13} aria-hidden="true" />
              <span>Resumen</span>
            </span>
            <h2 className="dashboard-panel__title">Resumen comercial</h2>
            <p className="dashboard-panel__subtitle">
              Señal actual, contexto y prioridad operativa.
            </p>
          </div>

          <div className="detail-grid detail-grid--responsive">
            <InfoBlock
              label="Sector"
              value={company.sector?.name}
              icon={<Building2 size={13} />}
            />
            <InfoBlock
              label="Zona principal"
              value={company.primary_zone?.name}
              icon={<MapPinned size={13} />}
            />
            <InfoBlock
              label="Intención actual"
              value={company.current_intention?.name}
              icon={<Target size={13} />}
            />
            <InfoBlock
              label="Interacciones totales"
              value={company.total_interactions_count}
              icon={<Radar size={13} />}
            />
            <InfoBlock
              label="Primera interacción"
              value={format_datetime(company.first_interaction_at)}
              icon={<CalendarClock size={13} />}
            />
            <InfoBlock
              label="Última interacción"
              value={format_datetime(company.last_interaction_at)}
              icon={<CalendarClock size={13} />}
            />
          </div>
        </section>

        <section className="detail-panel company-detail-page__panel company-detail-page__panel--enhanced company-detail-page__panel--responsive">
          <div className="dashboard-panel__header company-detail-page__panel-header company-detail-page__panel-header--responsive">
            <span className="section-chip company-detail-page__panel-chip company-detail-page__panel-chip--responsive">
              <UserRound size={13} aria-hidden="true" />
              <span>Contacto</span>
            </span>
            <h2 className="dashboard-panel__title">Contacto y datos base</h2>
            <p className="dashboard-panel__subtitle">
              Información estructurada capturada para explotación comercial.
            </p>
          </div>

          <div className="detail-grid detail-grid--responsive">
            <InfoBlock
              label="Persona de contacto"
              value={company.contact_person_name}
              icon={<UserRound size={13} />}
            />
            <InfoBlock
              label="Website"
              value={company.website}
              href={company.website || undefined}
              icon={<Globe size={13} />}
            />
            <InfoBlock
              label="Email negocio"
              value={company.business_email}
              href={company.business_email ? `mailto:${company.business_email}` : undefined}
              icon={<Mail size={13} />}
            />
            <InfoBlock
              label="Teléfono negocio"
              value={company.business_phone}
              href={company.business_phone ? `tel:${company.business_phone}` : undefined}
              icon={<Phone size={13} />}
            />
            <InfoBlock
              label="Nombre normalizado"
              value={company.normalized_company_name}
              icon={<Building2 size={13} />}
            />
            <InfoBlock
              label="ID empresa"
              value={company.id}
              icon={<Sparkles size={13} />}
            />
          </div>
        </section>

        <section className="detail-panel company-detail-page__panel company-detail-page__panel--priority company-detail-page__panel--enhanced company-detail-page__panel--responsive">
          <div className="dashboard-panel__header company-detail-page__panel-header company-detail-page__panel-header--responsive">
            <span className="section-chip company-detail-page__panel-chip company-detail-page__panel-chip--responsive">
              <CircleGauge size={13} aria-hidden="true" />
              <span>Prioridad</span>
            </span>
            <h2 className="dashboard-panel__title">Prioridad y trazabilidad</h2>
            <p className="dashboard-panel__subtitle">
              Justificación de scoring y fechas de control.
            </p>
          </div>

          <div className="detail-priority-card detail-priority-card--enhanced company-detail-page__priority-card company-detail-page__priority-card--responsive">
            <div className="detail-priority-card__top detail-priority-card__top--responsive">
              <span className={`priority-pill priority-pill--${priority_level}`}>
                <CircleGauge size={13} aria-hidden="true" />
                {format_label(priority_level)}
              </span>
              <strong className="detail-priority-card__score">{priority_score}</strong>
            </div>

            <div className="detail-priority-card__meter" aria-hidden="true">
              <span
                className={`detail-priority-card__meter-fill detail-priority-card__meter-fill--${priority_level}`}
              />
            </div>

            <p className="detail-priority-card__reason">{priority_reason}</p>
          </div>

          <div className="detail-grid detail-grid--responsive">
            <InfoBlock
              label="Creado"
              value={format_datetime(company.created_at)}
              icon={<CalendarClock size={13} />}
            />
            <InfoBlock
              label="Actualizado"
              value={format_datetime(company.updated_at)}
              icon={<CalendarClock size={13} />}
            />
          </div>
        </section>
      </div>
    </section>
  );
}

export default CompanyDetailPage;