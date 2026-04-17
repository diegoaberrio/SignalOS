import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { use_auth } from '../../context/AuthContext';
import {
  Activity,
  ArrowLeftToLine,
  Building2,
  Gauge,
  Radar,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: Gauge },
  { to: '/app/companies', label: 'Empresas', icon: Building2 },
  { to: '/app/interactions', label: 'Interacciones', icon: Radar },
  { to: '/app/users', label: 'Usuarios', icon: ShieldCheck },
];

function PrivateLayout() {
  const navigate = useNavigate();
  const { sign_out, user } = use_auth();

  function handle_logout() {
    sign_out();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell private-shell private-layout private-layout--responsive">
      <aside className="sidebar private-sidebar private-sidebar--responsive">
        <div className="sidebar-brand private-sidebar__brand private-sidebar__brand--responsive">
          <div className="private-sidebar__brand-top private-sidebar__brand-top--responsive">
            <span className="section-chip private-sidebar__chip private-sidebar__chip--responsive">
              <Sparkles size={14} aria-hidden="true" />
              <span>Private Console</span>
            </span>

            <Link
              to="/"
              className="brand-link private-sidebar__brand-link private-sidebar__brand-link--responsive"
            >
              <span className="private-sidebar__brand-icon" aria-hidden="true">
                <Activity size={16} />
              </span>
              <span className="private-sidebar__brand-label">SignalOS</span>
            </Link>
          </div>

          <p className="sidebar-caption private-sidebar__caption private-sidebar__caption--responsive">
            Prioriza señales, zonas y oportunidades con más claridad comercial.
          </p>

          {user ? (
            <div className="sidebar-user-chip private-sidebar__user-chip private-sidebar__user-chip--responsive">
              <span className="private-sidebar__user-dot" aria-hidden="true" />
              <span className="private-sidebar__user-text">
                {user.email || user.name || 'Usuario autenticado'}
              </span>
            </div>
          ) : null}
        </div>

        <nav
          className="sidebar-nav private-sidebar__nav private-sidebar__nav--responsive"
          aria-label="Navegación privada"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) =>
                `sidebar-link private-sidebar__link private-sidebar__link--responsive ${
                  isActive ? 'sidebar-link--active' : ''
                }`
              }
            >
              <span className="private-sidebar__icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="private-sidebar__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer private-sidebar__footer private-sidebar__footer--responsive">
          <div className="portfolio-zone private-sidebar__portfolio private-sidebar__portfolio--responsive">
            <span className="portfolio-zone__microchip private-sidebar__portfolio-chip">
              <Sparkles size={12} aria-hidden="true" />
              <span>Portfolio</span>
            </span>

            <a
              href="https://diegoincode.com"
              target="_blank"
              rel="noreferrer"
              className="portfolio-link private-sidebar__portfolio-link private-sidebar__portfolio-link--responsive"
              aria-label="Abrir portfolio de Diego In Code en una nueva pestaña"
            >
              <span>diegoincode.com</span>
            </a>
          </div>

          <button
            type="button"
            className="sidebar-link sidebar-link--button private-sidebar__logout private-sidebar__logout--responsive"
            onClick={handle_logout}
          >
            <span className="private-sidebar__icon" aria-hidden="true">
              <ArrowLeftToLine size={18} />
            </span>
            <span className="private-sidebar__label">Salir</span>
          </button>
        </div>
      </aside>

      <main className="private-content private-layout__content private-layout__content--responsive">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;