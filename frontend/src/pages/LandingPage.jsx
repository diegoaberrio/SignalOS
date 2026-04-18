import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

function LandingPage() {
  return (
    <section className="page-section hero-section landing-page landing-page--wow landing-page--responsive">
      <div className="landing-page__hero landing-page__hero--wow landing-page__hero--responsive">
        <span className="eyebrow landing-page__eyebrow landing-page__eyebrow--responsive">
          <Sparkles size={14} aria-hidden="true" />
          <span>Signal Intelligence for Territory-Led Sales</span>
        </span>

        <h1 className="page-title">
          Convierte interacciones empresariales en señales comerciales accionables.
        </h1>

        <p className="page-description landing-page__description landing-page__description--responsive">
          Plataforma B2B para captación territorial, análisis de intención y explotación comercial
          desde una experiencia pública ligera y una consola privada preparada para operación real.
        </p>

        <div className="company-card__badges landing-page__hero-badges landing-page__hero-badges--responsive">
          <span className="neutral-pill">
            <Radar size={13} aria-hidden="true" />
            Captura pública
          </span>
          <span className="neutral-pill">
            <Target size={13} aria-hidden="true" />
            Prioridad comercial
          </span>
          <span className="neutral-pill">
            <Compass size={13} aria-hidden="true" />
            Foco territorial
          </span>
        </div>

        <div className="landing-page__actions landing-page__actions--responsive">
          <Link
            to="/interact"
            className="button-primary landing-page__primary-action landing-page__cta-primary landing-page__cta-primary--responsive"
          >
            <Radar size={16} aria-hidden="true" />
            <span>Ir al formulario público</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <Link
            to="/login"
            className="secondary-button landing-page__secondary-action landing-page__cta-secondary landing-page__cta-secondary--responsive"
          >
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Acceder a la consola privada</span>
          </Link>
        </div>
      </div>

      <div className="landing-page__grid landing-page__grid--wow landing-page__grid--responsive">
        <article className="landing-page__info-card landing-page__info-card--wow landing-page__info-card--responsive">
          <div className="landing-page__info-top landing-page__info-top--responsive">
            <span className="landing-page__info-icon" aria-hidden="true">
              <Radar size={18} />
            </span>
            <span className="landing-page__info-label">Entrada pública</span>
          </div>

          <h2 className="landing-page__info-title">Captura interés y contexto comercial</h2>
          <p className="landing-page__info-text">
            Registra una interacción real desde una experiencia ligera y convierte ese primer
            contacto en una señal útil para lectura comercial.
          </p>
        </article>

        <article className="landing-page__info-card landing-page__info-card--wow landing-page__info-card--accent landing-page__info-card--responsive">
          <div className="landing-page__info-top landing-page__info-top--responsive">
            <span className="landing-page__info-icon" aria-hidden="true">
              <Compass size={18} />
            </span>
            <span className="landing-page__info-label">Consola privada</span>
          </div>

          <h2 className="landing-page__info-title">Explota señales con foco territorial</h2>
          <p className="landing-page__info-text">
            Consulta empresas, historial, prioridad y contexto operativo desde una vista privada
            conectada a la API real del sistema.
          </p>
        </article>

        <article className="landing-page__info-card landing-page__info-card--wow landing-page__info-card--responsive">
          <div className="landing-page__info-top landing-page__info-top--responsive">
            <span className="landing-page__info-icon" aria-hidden="true">
              <Target size={18} />
            </span>
            <span className="landing-page__info-label">Resultado</span>
          </div>

          <h2 className="landing-page__info-title">Más foco comercial, menos prospección a ciegas</h2>
          <p className="landing-page__info-text">
            Prioriza mejor por zona, intención y contexto para orientar la acción comercial hacia
            oportunidades con mayor sentido operativo.
          </p>
        </article>
      </div>
    </section>
  );
}

export default LandingPage;