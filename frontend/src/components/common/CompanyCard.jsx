import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  CircleGauge,
  Flag,
  MapPinned,
  Radar,
  Sparkles,
  Target,
} from 'lucide-react';

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

function CompanyCard({ company }) {
  const priority_level = company.priority?.level || 'default';
  const priority_score = company.priority?.score ?? '—';
  const company_status = format_label(company.company_status || 'unknown');
  const total_interactions = company.total_interactions_count ?? 0;

  return (
    <article className="company-card company-card--enhanced company-card--wow company-card--responsive">
      <div className="company-card__top company-card__top--responsive">
        <div className="company-card__identity company-card__identity--responsive">
          <div className="company-card__headline company-card__headline--responsive">
            <div className="company-card__headline-copy company-card__headline-copy--responsive">
              <div className="company-card__title-row company-card__title-row--responsive">
                <span className="company-card__title-icon" aria-hidden="true">
                  <Building2 size={16} />
                </span>
                <h3 className="company-card__name">{company.company_name}</h3>
              </div>

              <p className="company-card__summary">
                {company.sector?.name || 'Sector no definido'} · {company.zone?.name || 'Zona no definida'}
              </p>
            </div>

            <div
              className="company-card__score-block company-card__score-block--wow company-card__score-block--responsive"
              aria-label={`Score de prioridad ${priority_score}`}
            >
              <div className="company-card__score-top company-card__score-top--responsive">
                <span className="company-card__score-icon" aria-hidden="true">
                  <Sparkles size={14} />
                </span>
                <span className="company-card__score-label">Score</span>
              </div>
              <strong className="company-card__score-value">{priority_score}</strong>
            </div>
          </div>

          <div className="company-card__badges company-card__badges--wow company-card__badges--responsive">
            <span className={`priority-pill priority-pill--${priority_level}`}>
              <CircleGauge size={13} aria-hidden="true" />
              {format_label(priority_level)}
            </span>

            <span className="neutral-pill">
              <Flag size={13} aria-hidden="true" />
              {company_status}
            </span>

            <span className="neutral-pill">
              <Radar size={13} aria-hidden="true" />
              {total_interactions} interacciones
            </span>
          </div>
        </div>

        <Link
          to={`/app/companies/${company.id}`}
          className="button-primary company-card__action company-card__action--wow company-card__action--responsive"
        >
          <span>Ver ficha</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="company-card__grid company-card__grid--wow company-card__grid--responsive">
        <div className="company-card__meta-item company-card__meta-item--highlight company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <Target size={13} aria-hidden="true" />
            Intención actual
          </span>
          <strong>{company.current_intention?.name || '—'}</strong>
        </div>

        <div className="company-card__meta-item company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <Building2 size={13} aria-hidden="true" />
            Sector
          </span>
          <strong>{company.sector?.name || '—'}</strong>
        </div>

        <div className="company-card__meta-item company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <MapPinned size={13} aria-hidden="true" />
            Zona
          </span>
          <strong>{company.zone?.name || '—'}</strong>
        </div>

        <div className="company-card__meta-item company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <Radar size={13} aria-hidden="true" />
            Interacciones
          </span>
          <strong>{total_interactions}</strong>
        </div>

        <div className="company-card__meta-item company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <CalendarClock size={13} aria-hidden="true" />
            Primera interacción
          </span>
          <strong>{format_datetime(company.first_interaction_at)}</strong>
        </div>

        <div className="company-card__meta-item company-card__meta-item--wow company-card__meta-item--responsive">
          <span className="company-card__meta-label">
            <CalendarClock size={13} aria-hidden="true" />
            Última interacción
          </span>
          <strong>{format_datetime(company.last_interaction_at)}</strong>
        </div>
      </div>
    </article>
  );
}

export default CompanyCard;