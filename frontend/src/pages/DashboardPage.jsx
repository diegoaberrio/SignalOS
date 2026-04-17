import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  Gauge,
  Radar,
  RefreshCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import useDashboardSummary from '../hooks/useDashboardSummary';
import StatusCard from '../components/common/StatusCard';

function format_label(value) {
  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function format_datetime(value) {
  if (!value) return 'Sin fecha';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function get_safe_number(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function SummaryMetricCard({ label, value, max_value, tone = 'default', index = 0 }) {
  const numeric_value = get_safe_number(value);
  const safe_max = Math.max(get_safe_number(max_value), 1);
  const progress = Math.max(6, Math.min(100, Math.round((numeric_value / safe_max) * 100)));

  return (
    <article
      className={`metric-card metric-card--compact metric-card--visual metric-card--${tone} dashboard-metric-card dashboard-metric-card--responsive`}
    >
      <div className="metric-card__top dashboard-metric-card__top dashboard-metric-card__top--responsive">
        <div className="dashboard-metric-card__label-row dashboard-metric-card__label-row--responsive">
          <span className="dashboard-metric-card__icon" aria-hidden="true">
            {index === 0 ? <Sparkles size={16} /> : <BarChart3 size={16} />}
          </span>
          <span className="metric-card__label">{format_label(label)}</span>
        </div>

        <span className="metric-card__mini-kpi dashboard-metric-card__mini-kpi" aria-hidden="true">
          <span
            className="metric-card__mini-kpi-fill"
            style={{ width: `${progress}%` }}
          />
        </span>
      </div>

      <strong className="metric-card__value">{value ?? '—'}</strong>

      <div className="metric-card__footer dashboard-metric-card__footer dashboard-metric-card__footer--responsive">
        <span className="metric-card__helper">Peso relativo dentro del resumen</span>
        <span className="metric-card__percent">{progress}%</span>
      </div>
    </article>
  );
}

function PriorityBadge({ level, value, total }) {
  const numeric_value = get_safe_number(value);
  const numeric_total = Math.max(get_safe_number(total), 1);
  const percent = Math.round((numeric_value / numeric_total) * 100);

  return (
    <div className="priority-badge-card priority-badge-card--visual dashboard-priority-card dashboard-priority-card--responsive">
      <div className="priority-badge-card__header priority-badge-card__header--responsive">
        <span className="priority-badge-card__label">{format_label(level)}</span>
        <span className={`priority-pill priority-pill--${level || 'default'}`}>
          {percent}%
        </span>
      </div>

      <div className="priority-badge-card__visual" aria-hidden="true">
        <span
          className={`priority-badge-card__visual-fill priority-badge-card__visual-fill--${level || 'default'}`}
          style={{ width: `${Math.max(8, percent)}%` }}
        />
      </div>

      <strong className="priority-badge-card__value">{value}</strong>

      <span className="dashboard-priority-card__helper">
        Distribución relativa del volumen actual
      </span>
    </div>
  );
}

function ActivityItem({ item }) {
  return (
    <article className="activity-item dashboard-activity-item dashboard-activity-item--responsive">
      <div className="activity-item__top activity-item__top--responsive">
        <div className="dashboard-activity-item__identity dashboard-activity-item__identity--responsive">
          <span className="dashboard-activity-item__icon" aria-hidden="true">
            <Building2 size={16} />
          </span>
          <strong className="activity-item__company">
            {item.company_name || `Empresa #${item.company_id ?? '—'}`}
          </strong>
        </div>

        <span className={`priority-pill priority-pill--${item.priority_level || 'default'}`}>
          {format_label(item.priority_level || 'Sin prioridad')}
        </span>
      </div>

      <div className="activity-item__meta dashboard-activity-item__meta dashboard-activity-item__meta--responsive">
        <span>Interacción #{item.interaction_id ?? '—'}</span>
        <span>Empresa #{item.company_id ?? '—'}</span>
      </div>

      <div className="activity-item__date dashboard-activity-item__date">
        {format_datetime(item.submitted_at)}
      </div>
    </article>
  );
}

function DashboardPage() {
  const { summary, is_loading, error_message, reload_summary } = useDashboardSummary();

  if (is_loading) {
    return (
      <section className="page-section dashboard-page dashboard-page--responsive">
        <StatusCard
          title="Cargando dashboard"
          message="Estamos obteniendo el resumen comercial desde la API real."
          variant="loading"
        />
      </section>
    );
  }

  if (error_message) {
    return (
      <section className="page-section dashboard-page dashboard-page--responsive">
        <StatusCard
          title="No se pudo cargar el dashboard"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_summary}
        />
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="page-section dashboard-page dashboard-page--responsive">
        <StatusCard
          title="Sin datos de dashboard"
          message="La API respondió sin resumen utilizable por el momento."
          variant="empty"
          action_label="Recargar"
          on_action={reload_summary}
        />
      </section>
    );
  }

  const totals = summary.totals ?? {};
  const priority_breakdown = summary.priority_breakdown ?? {};
  const recent_activity = Array.isArray(summary.recent_activity) ? summary.recent_activity : [];

  const totals_entries = Object.entries(totals);
  const priority_entries = Object.entries(priority_breakdown);

  const max_total_value = totals_entries.length
    ? Math.max(...totals_entries.map(([, value]) => get_safe_number(value)), 1)
    : 1;

  const priority_total = priority_entries.reduce(
    (accumulator, [, value]) => accumulator + get_safe_number(value),
    0
  );

  const hero_total = totals_entries[0]?.[1] ?? '—';
  const hero_label = totals_entries[0]?.[0] ? format_label(totals_entries[0][0]) : 'Resumen';

  return (
    <section className="page-section dashboard-page dashboard-page--responsive">
      <div className="dashboard-header dashboard-page__hero dashboard-page__hero--enhanced dashboard-page__hero--responsive">
        <div className="dashboard-page__hero-copy dashboard-page__hero-copy--responsive">
          <span className="section-chip dashboard-page__hero-chip dashboard-page__hero-chip--responsive">
            <Gauge size={14} aria-hidden="true" />
            <span>Panel privado</span>
          </span>

          <h1 className="page-title">Dashboard comercial</h1>
          <p className="page-description">
            Resumen operativo conectado a <strong>GET /dashboard/summary</strong>.
          </p>

          <div className="company-card__badges dashboard-page__hero-badges dashboard-page__hero-badges--responsive">
            <span className="neutral-pill">
              <Radar size={13} aria-hidden="true" />
              Señales activas
            </span>
            <span className="neutral-pill">
              <Target size={13} aria-hidden="true" />
              Prioridad operativa
            </span>
            <span className="neutral-pill">
              <Activity size={13} aria-hidden="true" />
              Lectura en tiempo real
            </span>
          </div>
        </div>

        <div className="dashboard-page__hero-actions dashboard-page__hero-actions--responsive">
          <div className="dashboard-page__spotlight dashboard-page__spotlight--enhanced dashboard-page__spotlight--responsive">
            <div className="dashboard-page__spotlight-top dashboard-page__spotlight-top--responsive">
              <span className="dashboard-page__spotlight-icon" aria-hidden="true">
                <Sparkles size={16} />
              </span>
              <span className="dashboard-page__spotlight-label">{hero_label}</span>
            </div>

            <strong className="dashboard-page__spotlight-value">{hero_total}</strong>

            <div className="dashboard-page__spotlight-foot dashboard-page__spotlight-foot--responsive">
              <span className="dashboard-page__spotlight-helper">
                Indicador dominante del resumen actual
              </span>
              <span className="dashboard-page__spotlight-trend" aria-hidden="true">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>

          <button
            type="button"
            className="button-primary dashboard-page__refresh-button dashboard-page__refresh-button--responsive"
            onClick={reload_summary}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Actualizar
          </button>
        </div>
      </div>

      <div className="dashboard-sections dashboard-sections--responsive">
        <section className="dashboard-panel dashboard-panel--totals dashboard-panel--enhanced dashboard-panel--responsive">
          <div className="dashboard-panel__header dashboard-panel__header--enhanced dashboard-panel__header--responsive">
            <span className="section-chip dashboard-panel__mini-chip dashboard-panel__mini-chip--responsive">
              <BarChart3 size={13} aria-hidden="true" />
              <span>KPIs</span>
            </span>
            <h2 className="dashboard-panel__title">Totales</h2>
            <p className="dashboard-panel__subtitle">
              Indicadores principales del sistema con lectura visual comparativa.
            </p>
          </div>

          {totals_entries.length ? (
            <div className="metrics-grid metrics-grid--responsive">
              {totals_entries.map(([key, value], index) => (
                <SummaryMetricCard
                  key={key}
                  label={key}
                  value={value}
                  max_value={max_total_value}
                  tone={index === 0 ? 'accent' : 'default'}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <StatusCard
              title="Sin totales disponibles"
              message="La API no devolvió indicadores acumulados."
              variant="empty"
            />
          )}
        </section>

        <section className="dashboard-panel dashboard-panel--priority dashboard-panel--enhanced dashboard-panel--responsive">
          <div className="dashboard-panel__header dashboard-panel__header--enhanced dashboard-panel__header--responsive">
            <span className="section-chip dashboard-panel__mini-chip dashboard-panel__mini-chip--responsive">
              <Target size={13} aria-hidden="true" />
              <span>Prioridad</span>
            </span>
            <h2 className="dashboard-panel__title">Prioridad de señales</h2>
            <p className="dashboard-panel__subtitle">
              Distribución actual por nivel de prioridad con peso relativo.
            </p>
          </div>

          {priority_entries.length ? (
            <div className="priority-grid priority-grid--visual priority-grid--responsive">
              {priority_entries.map(([level, value]) => (
                <PriorityBadge
                  key={level}
                  level={level}
                  value={value}
                  total={priority_total}
                />
              ))}
            </div>
          ) : (
            <StatusCard
              title="Sin desglose de prioridad"
              message="Todavía no hay señales clasificadas por prioridad."
              variant="empty"
            />
          )}
        </section>

        <section className="dashboard-panel dashboard-panel--enhanced dashboard-panel--activity dashboard-panel--responsive">
          <div className="dashboard-panel__header dashboard-panel__header--enhanced dashboard-panel__header--responsive">
            <span className="section-chip dashboard-panel__mini-chip dashboard-panel__mini-chip--responsive">
              <Activity size={13} aria-hidden="true" />
              <span>Operación</span>
            </span>
            <h2 className="dashboard-panel__title">Actividad reciente</h2>
            <p className="dashboard-panel__subtitle">
              Últimas interacciones registradas
            </p>
          </div>

          {recent_activity.length ? (
            <div className="activity-list activity-list--responsive">
              {recent_activity.map((item) => (
                <ActivityItem
                  key={`${item.interaction_id}-${item.submitted_at}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <StatusCard
              title="Sin actividad reciente"
              message="No hay interacciones recientes disponibles."
              variant="empty"
            />
          )}
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;