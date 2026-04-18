import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Activity,
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
                  aria-label="Ir al inicio de SignalOS"
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