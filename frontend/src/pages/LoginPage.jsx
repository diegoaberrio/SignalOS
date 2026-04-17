import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Gauge,
  LockKeyhole,
  Mail,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { use_auth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { is_logging_in, auth_error, sign_in, clear_auth_error } = use_auth();

  const [form_data, setFormData] = useState({
    email: '',
    password: '',
  });

  const [local_error, setLocalError] = useState('');

  const redirect_to = location.state?.from?.pathname || '/app';

  const is_form_valid = useMemo(() => {
    return form_data.email.trim() !== '' && form_data.password.trim() !== '';
  }, [form_data]);

  function handle_change(event) {
    const { name, value } = event.target;

    clear_auth_error();

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handle_submit(event) {
    event.preventDefault();
    setLocalError('');
    clear_auth_error();

    if (!is_form_valid) {
      setLocalError('Debes completar email y contraseña.');
      return;
    }

    const response = await sign_in({
      email: form_data.email.trim(),
      password: form_data.password,
    });

    if (response.ok) {
      navigate(redirect_to, { replace: true });
    }
  }

  return (
    <section className="page-section auth-section narrow-section login-page login-page--responsive">
      <div className="login-page__grid login-page__grid--responsive">
        <div className="detail-panel login-page__panel login-page__panel--form login-page__panel--form-enhanced login-page__panel--responsive">
          <div className="auth-intro login-page__intro login-page__intro--responsive">
            <span className="section-chip login-page__hero-chip login-page__hero-chip--responsive">
              <LockKeyhole size={14} aria-hidden="true" />
              <span>Acceso privado</span>
            </span>

            <h1 className="page-title">Inicia sesión en SignalOS</h1>
            <p className="page-description">
              Accede a la consola comercial para consultar señales, empresas,
              historial y gestión interna.
            </p>

            <div className="company-card__badges login-page__hero-badges login-page__hero-badges--responsive">
              <span className="neutral-pill">
                <ShieldCheck size={13} aria-hidden="true" />
                Acceso seguro
              </span>
              <span className="neutral-pill">
                <Radar size={13} aria-hidden="true" />
                Consola privada
              </span>
            </div>
          </div>

          <form className="auth-form login-page__form login-page__form--responsive" onSubmit={handle_submit}>
            <div className="form-field login-page__field login-page__field--responsive">
              <label htmlFor="email" className="form-label">
                Email
              </label>

              <div className="login-page__input-shell login-page__input-shell--responsive">
                <span className="login-page__input-icon" aria-hidden="true">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input login-page__input login-page__input--responsive"
                  placeholder="tu@email.com"
                  value={form_data.email}
                  onChange={handle_change}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-field login-page__field login-page__field--responsive">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>

              <div className="login-page__input-shell login-page__input-shell--responsive">
                <span className="login-page__input-icon" aria-hidden="true">
                  <LockKeyhole size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input login-page__input login-page__input--responsive"
                  placeholder="••••••••"
                  value={form_data.password}
                  onChange={handle_change}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {local_error ? (
              <div className="form-feedback form-feedback--error" aria-live="polite">
                {local_error}
              </div>
            ) : null}

            {auth_error ? (
              <div className="form-feedback form-feedback--error" aria-live="polite">
                {auth_error}
              </div>
            ) : null}

            <button
              type="submit"
              className="button-primary auth-submit-button login-page__submit login-page__submit--responsive"
              disabled={!is_form_valid || is_logging_in}
            >
              <ArrowRight size={16} aria-hidden="true" />
              {is_logging_in ? 'Accediendo...' : 'Entrar'}
            </button>
          </form>
        </div>

        <aside className="detail-panel login-page__panel login-page__panel--aside login-page__panel--aside-enhanced login-page__panel--responsive">
          <div className="dashboard-panel__header login-page__aside-header login-page__aside-header--responsive">
            <span className="section-chip login-page__aside-chip login-page__aside-chip--responsive">
              <Sparkles size={14} aria-hidden="true" />
              <span>Consola SignalOS</span>
            </span>

            <h2 className="dashboard-panel__title">Qué encontrarás dentro</h2>
            <p className="dashboard-panel__subtitle">
              Un espacio privado orientado a priorizar oportunidades comerciales
              con más contexto territorial.
            </p>
          </div>

          <div className="login-page__aside-list login-page__aside-list--responsive">
            <div className="toolbar-stat login-page__feature-stat login-page__feature-stat--responsive">
              <span className="toolbar-stat__label">
                <Gauge size={13} aria-hidden="true" />
                Dashboard
              </span>
              <strong className="toolbar-stat__value">
                Resumen rápido de señales y prioridad
              </strong>
            </div>

            <div className="toolbar-stat login-page__feature-stat login-page__feature-stat--responsive">
              <span className="toolbar-stat__label">
                <Building2 size={13} aria-hidden="true" />
                Empresas
              </span>
              <strong className="toolbar-stat__value">
                Consulta de fichas y lectura comercial
              </strong>
            </div>

            <div className="toolbar-stat login-page__feature-stat login-page__feature-stat--responsive">
              <span className="toolbar-stat__label">
                <Radar size={13} aria-hidden="true" />
                Interacciones
              </span>
              <strong className="toolbar-stat__value">
                Historial útil para seguimiento y foco
              </strong>
            </div>

            <div className="toolbar-stat login-page__feature-stat login-page__feature-stat--responsive">
              <span className="toolbar-stat__label">
                <Users size={13} aria-hidden="true" />
                Usuarios
              </span>
              <strong className="toolbar-stat__value">
                Gestión interna del acceso y operación
              </strong>
            </div>
          </div>

          <div className="portfolio-zone login-page__portfolio login-page__portfolio--responsive">
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
              Zona general de enlace visual para reforzar credibilidad y
              presentación del producto.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default LoginPage;