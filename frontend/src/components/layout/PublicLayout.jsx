import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  Compass,
  LogIn,
  Sparkles,
  House,
} from 'lucide-react';

function PublicLayout() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  return (
    <div className="app-shell public-layout public-layout--responsive">
      <header className="topbar public-topbar public-topbar--responsive">
        <div className="page-container public-topbar__inner public-topbar__inner--responsive">
          <div className="brand-block public-brand-block public-brand-block--responsive">
            <div className="public-brand-meta public-brand-meta--responsive">
              <span className="section-chip public-brand-chip public-brand-chip--responsive">
                <Sparkles size={14} aria-hidden="true" />
                <span>Signal intelligence B2B</span>
              </span>

              <div className="public-brand-row public-brand-row--responsive">
                <Link
                  to="/"
                  className="brand-link public-brand-link public-brand-link--responsive"
                >
                  <span className="public-brand-link__icon" aria-hidden="true">
                    <Activity size={16} />
                  </span>
                  <span className="public-brand-link__label">SignalOS</span>
                </Link>

                <span
                  className="public-brand-inline-badge public-brand-inline-badge--responsive"
                  aria-label="Plataforma enfocada en exploración territorial"
                >
                  <Compass size={14} aria-hidden="true" />
                  <span>Territorial focus</span>
                </span>
              </div>
            </div>

            <span className="brand-badge public-brand-badge public-brand-badge--responsive">
              Inteligencia comercial territorial para decisiones con más foco
            </span>

            <div className="portfolio-zone public-layout__portfolio public-layout__portfolio--responsive">
              <div className="portfolio-zone__header portfolio-zone__header--responsive">
                <span className="portfolio-zone__microchip portfolio-zone__microchip--responsive">
                  <Sparkles size={12} aria-hidden="true" />
                  <span>Portfolio</span>
                </span>

                <a
                  href="https://diegoincode.com"
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio-link portfolio-zone__inline-link portfolio-zone__inline-link--responsive"
                  aria-label="Abrir portfolio de Diego In Code en una nueva pestaña"
                >
                  <span>diegoincode.com</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>

              <p className="portfolio-zone__text public-layout__portfolio-text">
                Espacio general de presentación y credibilidad visual del producto.
              </p>
            </div>
          </div>

          <nav
            className="topbar-nav public-topbar-nav public-topbar-nav--responsive"
            aria-label="Navegación pública"
          >
            <Link
              to="/"
              className={
                isHome
                  ? 'nav-link nav-link--primary public-nav-link public-nav-link--responsive'
                  : 'nav-link public-nav-link public-nav-link--responsive'
              }
              aria-current={isHome ? 'page' : undefined}
            >
              <House size={16} aria-hidden="true" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/login"
              className={
                isLogin
                  ? 'nav-link nav-link--primary public-nav-link public-nav-link--responsive'
                  : 'nav-link public-nav-link public-nav-link--responsive'
              }
              aria-current={isLogin ? 'page' : undefined}
            >
              <LogIn size={16} aria-hidden="true" />
              <span>Login</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="page-container public-main public-main--responsive">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;