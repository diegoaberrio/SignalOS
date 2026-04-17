import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, SearchX, Sparkles } from 'lucide-react';

function NotFoundPage() {
  return (
    <section className="page-section narrow-section not-found-page">
      <div className="not-found-page__content">
        <span className="section-chip not-found-page__chip">
          <SearchX size={14} aria-hidden="true" />
          404
        </span>

        <div className="not-found-page__hero">
          <span className="not-found-page__icon" aria-hidden="true">
            <Compass size={24} />
          </span>

          <h1 className="page-title">Página no encontrada</h1>

          <p className="page-description not-found-page__description">
            La ruta que intentas abrir no existe en esta versión del MVP.
          </p>
        </div>

        <div className="company-card__badges not-found-page__badges">
          <span className="neutral-pill">
            <Sparkles size={13} aria-hidden="true" />
            Ruta no disponible
          </span>
          <span className="neutral-pill">
            <Compass size={13} aria-hidden="true" />
            Vuelve a un punto seguro
          </span>
        </div>

        <Link to="/" className="button-primary not-found-page__action">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;