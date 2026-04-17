import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Building2,
  Filter,
  Radar,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
} from 'lucide-react';
import useCompanies from '../hooks/useCompanies';
import usePublicCatalogs from '../hooks/usePublicCatalogs';
import StatusCard from '../components/common/StatusCard';
import CompanyCard from '../components/common/CompanyCard';

const default_filters = {
  search: '',
  sector_id: '',
  zone_id: '',
  priority_level: '',
  company_status: '',
  sort_by: 'last_interaction_at',
  sort_order: 'desc',
  page: 1,
  page_size: 20,
};

const priority_options = ['low', 'medium', 'high', 'very_high'];
const status_options = ['active', 'inactive', 'archived'];

function format_label(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function build_request_params(filters) {
  const params = {
    page: filters.page,
    page_size: filters.page_size,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };

  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.sector_id) params.sector_id = Number(filters.sector_id);
  if (filters.zone_id) params.zone_id = Number(filters.zone_id);
  if (filters.priority_level) params.priority_level = filters.priority_level;
  if (filters.company_status) params.company_status = filters.company_status;

  return params;
}

function ActiveFilterChip({ label, on_remove }) {
  return (
    <button
      type="button"
      className="active-filter-chip companies-active-filter-chip companies-active-filter-chip--responsive"
      onClick={on_remove}
    >
      <span>{label}</span>
      <span className="companies-active-filter-chip__close" aria-hidden="true">
        ✕
      </span>
    </button>
  );
}

function CompaniesPage() {
  const [filters, setFilters] = useState(default_filters);

  const {
    companies,
    pagination,
    filters: applied_filters,
    is_loading,
    error_message,
    reload_companies,
    update_query_params,
  } = useCompanies(build_request_params(default_filters));

  const {
    zones,
    sectors,
    is_loading: catalogs_loading,
    error_message: catalogs_error,
    reload_catalogs,
  } = usePublicCatalogs();

  useEffect(() => {
    if (!applied_filters) return;

    setFilters((previous) => ({
      ...previous,
      search: applied_filters.search ?? '',
      sector_id: applied_filters.sector_id ? String(applied_filters.sector_id) : '',
      zone_id: applied_filters.zone_id ? String(applied_filters.zone_id) : '',
      priority_level: applied_filters.priority_level ?? '',
      company_status: applied_filters.company_status ?? '',
      sort_by: applied_filters.sort_by || previous.sort_by,
      sort_order: applied_filters.sort_order || previous.sort_order,
    }));
  }, [applied_filters]);

  const current_page = pagination?.page ?? 1;
  const total_pages = pagination?.total_pages ?? 1;
  const total_items = pagination?.total_items ?? companies.length;

  const sector_name = useMemo(
    () => sectors.find((item) => String(item.id) === String(filters.sector_id))?.name || '',
    [sectors, filters.sector_id]
  );

  const zone_name = useMemo(
    () => zones.find((item) => String(item.id) === String(filters.zone_id))?.name || '',
    [zones, filters.zone_id]
  );

  function set_filter(name, value) {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function apply_filters(event) {
    event.preventDefault();

    update_query_params(
      build_request_params({
        ...filters,
        page: 1,
      })
    );
  }

  function clear_filters() {
    setFilters(default_filters);
    update_query_params(build_request_params(default_filters));
  }

  function handle_previous_page() {
    if (current_page <= 1) return;

    update_query_params(
      build_request_params({
        ...filters,
        page: current_page - 1,
      })
    );
  }

  function handle_next_page() {
    if (current_page >= total_pages) return;

    update_query_params(
      build_request_params({
        ...filters,
        page: current_page + 1,
      })
    );
  }

  const has_active_filters = Boolean(
    filters.search ||
      filters.sector_id ||
      filters.zone_id ||
      filters.priority_level ||
      filters.company_status ||
      filters.sort_by !== default_filters.sort_by ||
      filters.sort_order !== default_filters.sort_order
  );

  const active_filter_count = [
    filters.search,
    filters.sector_id,
    filters.zone_id,
    filters.priority_level,
    filters.company_status,
  ].filter(Boolean).length;

  const current_sort_label = `${applied_filters?.sort_by || filters.sort_by} · ${
    applied_filters?.sort_order || filters.sort_order
  }`;

  if (catalogs_loading && !sectors.length && !zones.length) {
    return (
      <section className="page-section companies-page companies-page--responsive">
        <StatusCard
          title="Cargando filtros"
          message="Estamos preparando sectores y zonas para el panel de búsqueda."
          variant="loading"
        />
      </section>
    );
  }

  if (catalogs_error && !sectors.length && !zones.length) {
    return (
      <section className="page-section companies-page companies-page--responsive">
        <StatusCard
          title="No se pudieron cargar los filtros"
          message={catalogs_error}
          variant="error"
          action_label="Reintentar"
          on_action={reload_catalogs}
        />
      </section>
    );
  }

  return (
    <section className="page-section companies-page companies-page--responsive">
      <div className="dashboard-header companies-page__hero companies-page__hero--enhanced companies-page__hero--responsive">
        <div className="companies-page__hero-copy companies-page__hero-copy--responsive">
          <span className="section-chip companies-page__hero-chip companies-page__hero-chip--responsive">
            <Building2 size={14} aria-hidden="true" />
            <span>Empresas</span>
          </span>

          <h1 className="page-title">Listado de empresas</h1>
          <p className="page-description">
            Vista conectada a <strong>GET /companies</strong> con búsqueda,
            filtros, ordenación y paginación reales.
          </p>

          <div className="company-card__badges companies-page__hero-badges companies-page__hero-badges--responsive">
            <span className="neutral-pill">
              <Search size={13} aria-hidden="true" />
              Búsqueda real
            </span>
            <span className="neutral-pill">
              <Filter size={13} aria-hidden="true" />
              Filtros activos
            </span>
            <span className="neutral-pill">
              <Radar size={13} aria-hidden="true" />
              Paginación API
            </span>
          </div>
        </div>

        <div className="companies-page__hero-actions companies-page__hero-actions--responsive">
          <div className="companies-page__spotlight companies-page__spotlight--enhanced companies-page__spotlight--responsive">
            <div className="companies-page__spotlight-top companies-page__spotlight-top--responsive">
              <span className="companies-page__spotlight-icon" aria-hidden="true">
                <Sparkles size={16} />
              </span>
              <span className="companies-page__spotlight-label">Resultados actuales</span>
            </div>

            <strong className="companies-page__spotlight-value">{total_items}</strong>

            <span className="companies-page__spotlight-helper">
              Empresas visibles según el filtro aplicado
            </span>
          </div>

          <button
            type="button"
            className="button-primary companies-page__refresh-button companies-page__refresh-button--responsive"
            onClick={reload_companies}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Actualizar
          </button>
        </div>
      </div>

      <form
        className="companies-filter-panel companies-filter-panel--enhanced companies-filter-panel--magic companies-filter-panel--responsive"
        onSubmit={apply_filters}
      >
        <div className="dashboard-panel__header companies-filter-panel__header companies-filter-panel__header--enhanced companies-filter-panel__header--responsive">
          <span className="section-chip companies-filter-panel__chip companies-filter-panel__chip--responsive">
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Panel de control</span>
          </span>
          <h2 className="dashboard-panel__title">Filtrar y ordenar</h2>
          <p className="dashboard-panel__subtitle">
            Ajusta el foco del listado por empresa, zona, sector, prioridad y estado.
          </p>
        </div>

        <div className="companies-filter-grid companies-filter-grid--responsive">
          <div className="form-field companies-filter-field companies-filter-field--search companies-filter-field--responsive">
            <label className="form-label" htmlFor="company_search">
              Buscar
            </label>
            <div className="companies-filter-input-shell companies-filter-input-shell--responsive">
              <span className="companies-filter-input-shell__icon" aria-hidden="true">
                <Search size={16} />
              </span>
              <input
                id="company_search"
                className="form-input companies-filter-input companies-filter-input--with-icon companies-filter-input--responsive"
                value={filters.search}
                onChange={(event) => set_filter('search', event.target.value)}
                placeholder="Nombre de empresa"
              />
            </div>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="sector_id">
              Sector
            </label>
            <select
              id="sector_id"
              className="form-input"
              value={filters.sector_id}
              onChange={(event) => set_filter('sector_id', event.target.value)}
            >
              <option value="">Todos</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="zone_id">
              Zona
            </label>
            <select
              id="zone_id"
              className="form-input"
              value={filters.zone_id}
              onChange={(event) => set_filter('zone_id', event.target.value)}
            >
              <option value="">Todas</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="priority_level">
              Prioridad
            </label>
            <select
              id="priority_level"
              className="form-input"
              value={filters.priority_level}
              onChange={(event) => set_filter('priority_level', event.target.value)}
            >
              <option value="">Todas</option>
              {priority_options.map((priority) => (
                <option key={priority} value={priority}>
                  {format_label(priority)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="company_status">
              Estado
            </label>
            <select
              id="company_status"
              className="form-input"
              value={filters.company_status}
              onChange={(event) => set_filter('company_status', event.target.value)}
            >
              <option value="">Todos</option>
              {status_options.map((status) => (
                <option key={status} value={status}>
                  {format_label(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="sort_by">
              Ordenar por
            </label>
            <select
              id="sort_by"
              className="form-input"
              value={filters.sort_by}
              onChange={(event) => set_filter('sort_by', event.target.value)}
            >
              <option value="last_interaction_at">Última interacción</option>
              <option value="company_name">Nombre empresa</option>
              <option value="created_at">Fecha creación</option>
              <option value="current_priority_score">Score prioridad</option>
            </select>
          </div>

          <div className="form-field companies-filter-field companies-filter-field--responsive">
            <label className="form-label" htmlFor="sort_order">
              Sentido
            </label>
            <select
              id="sort_order"
              className="form-input"
              value={filters.sort_order}
              onChange={(event) => set_filter('sort_order', event.target.value)}
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>

        <div className="companies-filter-actions companies-filter-actions--responsive">
          <button type="submit" className="button-primary companies-filter-action companies-filter-action--primary">
            <Filter size={16} aria-hidden="true" />
            Aplicar filtros
          </button>

          <button
            type="button"
            className="secondary-button companies-filter-action companies-filter-action--secondary"
            onClick={clear_filters}
            disabled={!has_active_filters}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Limpiar
          </button>
        </div>
      </form>

      {has_active_filters ? (
        <div className="active-filters-row companies-active-filters-row companies-active-filters-row--responsive">
          {filters.search ? (
            <ActiveFilterChip
              label={`Búsqueda: ${filters.search}`}
              on_remove={() => {
                const next = { ...filters, search: '', page: 1 };
                setFilters(next);
                update_query_params(build_request_params(next));
              }}
            />
          ) : null}

          {filters.sector_id ? (
            <ActiveFilterChip
              label={`Sector: ${sector_name || filters.sector_id}`}
              on_remove={() => {
                const next = { ...filters, sector_id: '', page: 1 };
                setFilters(next);
                update_query_params(build_request_params(next));
              }}
            />
          ) : null}

          {filters.zone_id ? (
            <ActiveFilterChip
              label={`Zona: ${zone_name || filters.zone_id}`}
              on_remove={() => {
                const next = { ...filters, zone_id: '', page: 1 };
                setFilters(next);
                update_query_params(build_request_params(next));
              }}
            />
          ) : null}

          {filters.priority_level ? (
            <ActiveFilterChip
              label={`Prioridad: ${format_label(filters.priority_level)}`}
              on_remove={() => {
                const next = { ...filters, priority_level: '', page: 1 };
                setFilters(next);
                update_query_params(build_request_params(next));
              }}
            />
          ) : null}

          {filters.company_status ? (
            <ActiveFilterChip
              label={`Estado: ${format_label(filters.company_status)}`}
              on_remove={() => {
                const next = { ...filters, company_status: '', page: 1 };
                setFilters(next);
                update_query_params(build_request_params(next));
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div className="list-toolbar list-toolbar--enhanced companies-list-toolbar companies-list-toolbar--responsive">
        <div className="toolbar-stat toolbar-stat--featured companies-toolbar-stat companies-toolbar-stat--featured companies-toolbar-stat--responsive">
          <span className="toolbar-stat__label">
            <Building2 size={13} aria-hidden="true" />
            Empresas
          </span>
          <strong className="toolbar-stat__value">{total_items}</strong>
        </div>

        <div className="toolbar-stat companies-toolbar-stat companies-toolbar-stat--responsive">
          <span className="toolbar-stat__label">
            <Radar size={13} aria-hidden="true" />
            Página
          </span>
          <strong className="toolbar-stat__value">
            {current_page} / {total_pages}
          </strong>
        </div>

        <div className="toolbar-stat companies-toolbar-stat companies-toolbar-stat--responsive">
          <span className="toolbar-stat__label">
            <ArrowDownUp size={13} aria-hidden="true" />
            Orden actual
          </span>
          <strong className="toolbar-stat__value">{current_sort_label}</strong>
        </div>

        <div className="toolbar-stat companies-toolbar-stat companies-toolbar-stat--responsive">
          <span className="toolbar-stat__label">
            <Target size={13} aria-hidden="true" />
            Filtros activos
          </span>
          <strong className="toolbar-stat__value">{active_filter_count}</strong>
        </div>
      </div>

      {is_loading ? (
        <StatusCard
          title="Cargando empresas"
          message="Estamos consultando el listado real de empresas desde la API."
          variant="loading"
        />
      ) : error_message ? (
        <StatusCard
          title="No se pudo cargar el listado"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_companies}
        />
      ) : companies.length === 0 ? (
        <StatusCard
          title="Sin resultados"
          message="No hemos encontrado empresas con los filtros actuales."
          variant="empty"
        />
      ) : (
        <div className="company-list companies-page__list companies-page__list--responsive">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      <div className="pagination-bar pagination-bar--enhanced companies-pagination-bar companies-pagination-bar--responsive">
        <button
          type="button"
          className="pagination-button companies-pagination-button companies-pagination-button--responsive"
          onClick={handle_previous_page}
          disabled={current_page <= 1}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Anterior
        </button>

        <span className="pagination-bar__info companies-pagination-bar__info">
          Página {current_page} de {total_pages}
        </span>

        <button
          type="button"
          className="pagination-button companies-pagination-button companies-pagination-button--responsive"
          onClick={handle_next_page}
          disabled={current_page >= total_pages}
        >
          Siguiente
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default CompaniesPage;