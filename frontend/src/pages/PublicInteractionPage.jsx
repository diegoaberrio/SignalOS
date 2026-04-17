import { useMemo, useState } from 'react';
import {
  Building2,
  CircleCheckBig,
  Compass,
  Handshake,
  Lightbulb,
  Radar,
  RefreshCcw,
  Send,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import usePublicCatalogs from '../hooks/usePublicCatalogs';
import usePublicInteractionForm from '../hooks/usePublicInteractionForm';
import StatusCard from '../components/common/StatusCard';
import { build_public_result_model } from '../utils/publicResults';

function PublicSectionHeader({ chip, title, description, icon }) {
  return (
    <div className="dashboard-panel__header public-section-header public-section-header--enhanced public-section-header--responsive">
      {chip ? (
        <span className="section-chip public-section-header__chip public-section-header__chip--responsive">
          {icon ? (
            <span className="public-section-header__chip-icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span>{chip}</span>
        </span>
      ) : null}

      <div className="public-section-header__content public-section-header__content--responsive">
        <h2 className="dashboard-panel__title public-section-header__title">
          {title}
        </h2>
        <p className="dashboard-panel__subtitle">{description}</p>
      </div>
    </div>
  );
}

function PublicResultPanel({ submit_success, form_data, on_reset }) {
  const result = useMemo(
    () => build_public_result_model({ submit_success, form_data }),
    [submit_success, form_data]
  );

  const [active_match_index, setActiveMatchIndex] = useState(0);
  const [review_requested, setReviewRequested] = useState(false);

  const active_match = result.matches[active_match_index];

  function handle_next_match() {
    setActiveMatchIndex((previous) => (previous + 1) % result.matches.length);
  }

  function handle_request_review() {
    const review_payload = {
      interaction_id: submit_success?.interaction_id ?? null,
      company_id: submit_success?.company_id ?? null,
      requested_at: new Date().toISOString(),
      company_name: form_data.company_name,
      representative_email: form_data.representative_email || null,
      business_email: form_data.business_email || null,
      zone_name: form_data.zone_name || null,
      sector_name: form_data.sector_name || null,
      intention_name: form_data.intention_name || null,
      priority_level: submit_success?.priority?.level || null,
      priority_score: submit_success?.priority?.score || null,
    };

    const existing = JSON.parse(
      localStorage.getItem('signalos_public_review_requests') || '[]'
    );

    localStorage.setItem(
      'signalos_public_review_requests',
      JSON.stringify([review_payload, ...existing].slice(0, 20))
    );

    setReviewRequested(true);
  }

  return (
    <div className="public-result-stack public-result-stack--responsive">
      <section className="public-result-hero public-result-hero--enhanced public-result-hero--responsive">
        <div className="public-result-hero__content public-result-hero__content--responsive">
          <span className="section-chip public-result-hero__chip public-result-hero__chip--responsive">
            <CircleCheckBig size={14} aria-hidden="true" />
            <span>Resultado inicial</span>
          </span>

          <h2 className="public-result-hero__title">{result.hero.title}</h2>
          <p className="public-result-hero__description">{result.hero.description}</p>

          <div className="company-card__badges public-result-hero__badges public-result-hero__badges--responsive">
            {result.hero.zone_name ? (
              <span className="neutral-pill">
                <MapPinnedIcon />
                Zona: {result.hero.zone_name}
              </span>
            ) : null}
            {result.hero.sector_name ? (
              <span className="neutral-pill">
                <Building2 size={13} aria-hidden="true" />
                Sector: {result.hero.sector_name}
              </span>
            ) : null}
            {result.hero.intention_name ? (
              <span className="neutral-pill">
                <Target size={13} aria-hidden="true" />
                Intención: {result.hero.intention_name}
              </span>
            ) : null}
          </div>
        </div>

        <div className="public-result-hero__metrics public-result-hero__metrics--responsive">
          <div className="toolbar-stat public-hero-stat public-hero-stat--priority public-hero-stat--responsive">
            <span className="toolbar-stat__label">Prioridad</span>
            <strong className="toolbar-stat__value">{result.hero.priority_level}</strong>
          </div>

          <div className="toolbar-stat public-hero-stat public-hero-stat--responsive">
            <span className="toolbar-stat__label">Score</span>
            <strong className="toolbar-stat__value">{result.hero.priority_score}</strong>
          </div>

          <div className="toolbar-stat public-hero-stat public-hero-stat--responsive">
            <span className="toolbar-stat__label">Acción empresa</span>
            <strong className="toolbar-stat__value">{result.hero.company_action}</strong>
          </div>

          <div className="toolbar-stat public-hero-stat public-hero-stat--responsive">
            <span className="toolbar-stat__label">Interaction ID</span>
            <strong className="toolbar-stat__value">
              {submit_success.interaction_id ?? '—'}
            </strong>
          </div>
        </div>
      </section>

      {result.hero.priority_reason ? (
        <section className="detail-panel public-priority-reason public-priority-reason--responsive">
          <PublicSectionHeader
            chip="Lectura del sistema"
            icon={<Lightbulb size={14} />}
            title="Por qué obtuviste este resultado"
            description="Explicación inicial basada en la prioridad calculada por el sistema."
          />

          <p className="public-priority-reason__text">{result.hero.priority_reason}</p>
        </section>
      ) : null}

      <section className="detail-panel public-insights-panel public-insights-panel--responsive">
        <PublicSectionHeader
          chip="Señales agregadas"
          icon={<Radar size={14} />}
          title="Lectura rápida de encaje"
          description="Señales agregadas y recomendación inicial sin exponer datos privados de terceros."
        />

        <div className="public-success-grid public-success-grid--responsive">
          {result.insights.map((item) => (
            <div
              key={item.label}
              className="toolbar-stat public-insight-stat public-insight-stat--responsive"
            >
              <span className="toolbar-stat__label">{item.label}</span>
              <strong className="toolbar-stat__value">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-panel public-match-panel public-match-panel--responsive">
        <PublicSectionHeader
          chip="Afinidad sugerida"
          icon={<Handshake size={14} />}
          title="Coincidencia sugerida"
          description="Vista agregada y anonimizada de un perfil potencialmente compatible."
        />

        <article className="public-match-card public-match-card--featured public-match-card--enhanced public-match-card--responsive">
          <div className="public-match-card__top public-match-card__top--responsive">
            <strong className="public-match-card__id">
              Perfil compatible #{active_match.id}
            </strong>
            <span className="neutral-pill public-match-card__affinity public-match-card__affinity--responsive">
              <Sparkles size={13} aria-hidden="true" />
              {active_match.compatibility}% afinidad
            </span>
          </div>

          <div className="public-match-card__body public-match-card__body--grid public-match-card__body--responsive">
            <div className="company-card__meta-item public-match-card__meta-item public-match-card__meta-item--responsive">
              <span className="company-card__meta-label">Sector</span>
              <strong>{active_match.sector}</strong>
            </div>

            <div className="company-card__meta-item public-match-card__meta-item public-match-card__meta-item--responsive">
              <span className="company-card__meta-label">Zona</span>
              <strong>{active_match.zone}</strong>
            </div>

            <div className="company-card__meta-item public-match-card__meta-item public-match-card__meta-item--responsive">
              <span className="company-card__meta-label">Relación sugerida</span>
              <strong>{active_match.relation_type}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="public-cta-card public-cta-card--enhanced public-cta-card--responsive">
        <PublicSectionHeader
          chip="Siguiente paso"
          icon={<Send size={14} />}
          title={result.cta.title}
          description={result.cta.description}
        />

        {review_requested ? (
          <div
            className="form-feedback form-feedback--success public-cta-card__feedback"
            aria-live="polite"
          >
            Tu interés ha quedado marcado para revisión comercial. Hemos guardado
            esta solicitud localmente como siguiente paso del flujo público.
          </div>
        ) : null}

        <div className="public-cta-card__actions public-cta-card__actions--responsive">
          <button
            type="button"
            className="button-primary public-cta-card__action-primary"
            onClick={handle_request_review}
          >
            <Send size={16} aria-hidden="true" />
            {result.cta.primary_label}
          </button>

          <button
            type="button"
            className="secondary-button public-cta-card__action-secondary"
            onClick={handle_next_match}
          >
            <Sparkles size={16} aria-hidden="true" />
            {result.cta.secondary_label}
          </button>

          <button
            type="button"
            className="secondary-button public-cta-card__action-secondary"
            onClick={on_reset}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Enviar otra interacción
          </button>
        </div>
      </section>
    </div>
  );
}

function PublicInteractionPage() {
  const {
    zones,
    sectors,
    intentions,
    is_loading,
    error_message,
    reload_catalogs,
  } = usePublicCatalogs();

  const {
    form_data,
    is_submitting,
    submit_error,
    submit_success,
    validation_error,
    update_field,
    submit_form,
    reset_form,
  } = usePublicInteractionForm();

  function handle_change(event) {
    const { name, value, type, checked } = event.target;
    update_field(name, type === 'checkbox' ? checked : value);
  }

  async function handle_submit(event) {
    event.preventDefault();
    const response = await submit_form();

    if (response?.ok) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const selected_sector_name =
    sectors.find((sector) => String(sector.id) === String(form_data.sector_id))?.name || '';

  const selected_zone_name =
    zones.find((zone) => String(zone.id) === String(form_data.consulted_zone_id))?.name || '';

  const selected_intention_name =
    intentions.find((intention) => String(intention.id) === String(form_data.intention_id))?.name || '';

  const enriched_form_data = {
    ...form_data,
    sector_name: selected_sector_name,
    zone_name: selected_zone_name,
    intention_name: selected_intention_name,
  };

  const activeSummary = [
    selected_zone_name ? `Zona: ${selected_zone_name}` : null,
    selected_sector_name ? `Sector: ${selected_sector_name}` : null,
    selected_intention_name ? `Intención: ${selected_intention_name}` : null,
  ].filter(Boolean);

  if (is_loading) {
    return (
      <section className="page-section public-interaction-page public-interaction-page--responsive">
        <StatusCard
          title="Cargando formulario público"
          message="Estamos obteniendo los catálogos reales de zonas, sectores e intenciones."
          variant="loading"
        />
      </section>
    );
  }

  if (error_message) {
    return (
      <section className="page-section public-interaction-page public-interaction-page--responsive">
        <StatusCard
          title="No se pudo preparar el formulario"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_catalogs}
        />
      </section>
    );
  }

  return (
    <section className="page-section public-interaction-page public-interaction-page--responsive">
      <div className="dashboard-header public-page-hero public-page-hero--enhanced public-page-hero--responsive">
        <div className="public-page-hero__content public-page-hero__content--responsive">
          <span className="section-chip public-page-hero__chip public-page-hero__chip--responsive">
            <Radar size={14} aria-hidden="true" />
            <span>Flujo público</span>
          </span>

          <h1 className="page-title">Registra tu interés comercial</h1>
          <p className="page-description">
            Comparte tu contexto y recibe una lectura inicial de encaje,
            prioridad y coincidencias relacionadas.
          </p>

          <div className="company-card__badges public-page-hero__badges public-page-hero__badges--responsive">
            <span className="neutral-pill">
              <Sparkles size={13} aria-hidden="true" />
              Señales iniciales
            </span>
            <span className="neutral-pill">
              <Compass size={13} aria-hidden="true" />
              Lectura agregada
            </span>
            <span className="neutral-pill">
              <Handshake size={13} aria-hidden="true" />
              Sin exponer terceros
            </span>
          </div>
        </div>
      </div>

      {submit_success ? (
        <PublicResultPanel
          submit_success={submit_success}
          form_data={enriched_form_data}
          on_reset={reset_form}
        />
      ) : (
        <div className="public-form-layout public-form-layout--responsive">
          <form
            className="public-form public-form--animated public-form--responsive"
            onSubmit={handle_submit}
          >
            <div className="detail-panel public-form-panel public-form-panel--enhanced public-form-panel--responsive">
              <PublicSectionHeader
                chip="Paso 1"
                icon={<Building2 size={14} />}
                title="Empresa"
                description="Datos base de la organización para contextualizar la oportunidad."
              />

              <div className="public-form-grid public-form-grid--responsive">
                <div className="form-field">
                  <label htmlFor="company_name" className="form-label">
                    Nombre de empresa
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    className="form-input"
                    value={form_data.company_name}
                    onChange={handle_change}
                    placeholder="Tecnored Castilla"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    className="form-input"
                    value={form_data.website}
                    onChange={handle_change}
                    placeholder="https://empresa.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="business_email" className="form-label">
                    Email negocio
                  </label>
                  <input
                    id="business_email"
                    name="business_email"
                    type="email"
                    className="form-input"
                    value={form_data.business_email}
                    onChange={handle_change}
                    placeholder="info@empresa.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="business_phone" className="form-label">
                    Teléfono negocio
                  </label>
                  <input
                    id="business_phone"
                    name="business_phone"
                    className="form-input"
                    value={form_data.business_phone}
                    onChange={handle_change}
                    placeholder="+34900000000"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact_person_name" className="form-label">
                    Persona de contacto
                  </label>
                  <input
                    id="contact_person_name"
                    name="contact_person_name"
                    className="form-input"
                    value={form_data.contact_person_name}
                    onChange={handle_change}
                    placeholder="Ana Torres"
                  />
                </div>
              </div>
            </div>

            <div className="detail-panel public-form-panel public-form-panel--enhanced public-form-panel--responsive">
              <PublicSectionHeader
                chip="Paso 2"
                icon={<UserRound size={14} />}
                title="Representante"
                description="Datos de la persona que realiza esta interacción en nombre del negocio."
              />

              <div className="public-form-grid public-form-grid--responsive">
                <div className="form-field">
                  <label htmlFor="representative_name" className="form-label">
                    Nombre representante
                  </label>
                  <input
                    id="representative_name"
                    name="representative_name"
                    className="form-input"
                    value={form_data.representative_name}
                    onChange={handle_change}
                    placeholder="Ana Torres"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="representative_email" className="form-label">
                    Email representante
                  </label>
                  <input
                    id="representative_email"
                    name="representative_email"
                    type="email"
                    className="form-input"
                    value={form_data.representative_email}
                    onChange={handle_change}
                    placeholder="ana@empresa.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="representative_phone" className="form-label">
                    Teléfono representante
                  </label>
                  <input
                    id="representative_phone"
                    name="representative_phone"
                    className="form-input"
                    value={form_data.representative_phone}
                    onChange={handle_change}
                    placeholder="+34600000000"
                  />
                </div>
              </div>
            </div>

            <div className="detail-panel public-form-panel public-form-panel--enhanced public-form-panel--responsive">
              <PublicSectionHeader
                chip="Paso 3"
                icon={<Target size={14} />}
                title="Contexto comercial"
                description="Selección real de zona, sector e intención para construir una lectura inicial útil."
              />

              <div className="public-form-grid public-form-grid--responsive">
                <div className="form-field">
                  <label htmlFor="sector_id" className="form-label">
                    Sector
                  </label>
                  <select
                    id="sector_id"
                    name="sector_id"
                    className="form-input"
                    value={form_data.sector_id}
                    onChange={handle_change}
                  >
                    <option value="">Selecciona un sector</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="consulted_zone_id" className="form-label">
                    Zona
                  </label>
                  <select
                    id="consulted_zone_id"
                    name="consulted_zone_id"
                    className="form-input"
                    value={form_data.consulted_zone_id}
                    onChange={handle_change}
                  >
                    <option value="">Selecciona una zona</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="intention_id" className="form-label">
                    Intención
                  </label>
                  <select
                    id="intention_id"
                    name="intention_id"
                    className="form-input"
                    value={form_data.intention_id}
                    onChange={handle_change}
                  >
                    <option value="">Selecciona una intención</option>
                    {intentions.map((intention) => (
                      <option key={intention.id} value={intention.id}>
                        {intention.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="detail-panel public-form-panel public-form-panel--submit public-form-panel--enhanced public-form-panel--responsive">
              <PublicSectionHeader
                chip="Paso 4"
                icon={<Send size={14} />}
                title="Confirmación y envío"
                description="Revisamos el consentimiento y enviamos la interacción para obtener una lectura inicial."
              />

              <div className="consent-row consent-row--responsive">
                <label className="consent-checkbox consent-checkbox--enhanced consent-checkbox--responsive">
                  <input
                    type="checkbox"
                    name="consent_accepted"
                    checked={form_data.consent_accepted}
                    onChange={handle_change}
                  />
                  <span>
                    Acepto el consentimiento requerido para enviar la interacción.
                  </span>
                </label>
              </div>

              {validation_error ? (
                <div className="form-feedback form-feedback--error" aria-live="polite">
                  {validation_error}
                </div>
              ) : null}

              {submit_error ? (
                <div className="form-feedback form-feedback--error" aria-live="polite">
                  {submit_error}
                </div>
              ) : null}

              <button
                type="submit"
                className="button-primary public-submit-button public-submit-button--responsive"
                disabled={is_submitting}
              >
                <Send size={16} aria-hidden="true" />
                {is_submitting ? 'Enviando...' : 'Enviar interacción'}
              </button>
            </div>
          </form>

          <aside className="detail-panel public-form-aside public-form-aside--enhanced public-form-aside--responsive">
            <PublicSectionHeader
              chip="Resumen activo"
              icon={<Sparkles size={14} />}
              title="Qué estás enviando"
              description="Vista rápida del contexto actual antes de generar la lectura inicial."
            />

            <div className="public-form-aside__stack public-form-aside__stack--responsive">
              <div className="toolbar-stat public-form-summary-stat public-form-summary-stat--responsive">
                <span className="toolbar-stat__label">
                  <Building2 size={13} aria-hidden="true" />
                  Empresa
                </span>
                <strong className="toolbar-stat__value">
                  {form_data.company_name || 'Pendiente'}
                </strong>
              </div>

              <div className="toolbar-stat public-form-summary-stat public-form-summary-stat--responsive">
                <span className="toolbar-stat__label">
                  <UserRound size={13} aria-hidden="true" />
                  Representante
                </span>
                <strong className="toolbar-stat__value">
                  {form_data.representative_name || 'Pendiente'}
                </strong>
              </div>

              <div className="toolbar-stat public-form-summary-stat public-form-summary-stat--responsive">
                <span className="toolbar-stat__label">
                  <Compass size={13} aria-hidden="true" />
                  Contexto seleccionado
                </span>

                <div className="company-card__badges public-form-aside__badges public-form-aside__badges--responsive">
                  {activeSummary.length ? (
                    activeSummary.map((item) => (
                      <span key={item} className="neutral-pill">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="neutral-pill">Aún sin contexto seleccionado</span>
                  )}
                </div>
              </div>

              <div className="toolbar-stat public-form-summary-stat public-form-summary-stat--accent public-form-summary-stat--responsive">
                <span className="toolbar-stat__label">
                  <Lightbulb size={13} aria-hidden="true" />
                  Qué recibirás
                </span>
                <strong className="toolbar-stat__value">
                  Prioridad, lectura inicial y coincidencia sugerida
                </strong>
              </div>

              <div className="portfolio-zone public-form-aside__portfolio public-form-aside__portfolio--responsive">
                <div className="portfolio-zone__header portfolio-zone__header--responsive">
                  <span className="portfolio-zone__microchip">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>Portfolio</span>
                  </span>
                  <a
                    href="https://diegoincode.com"
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-link portfolio-zone__inline-link portfolio-zone__inline-link--responsive"
                  >
                    <span>diegoincode.com</span>
                  </a>
                </div>
                <p className="portfolio-zone__text">
                  Espacio general preparado para enlazar credibilidad visual y
                  producto.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function MapPinnedIcon() {
  return <Compass size={13} aria-hidden="true" />;
}

export default PublicInteractionPage;