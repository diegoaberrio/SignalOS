import { Navigate, Outlet } from 'react-router-dom';
import { use_auth } from '../context/AuthContext';
import StatusCard from '../components/common/StatusCard';

function PublicOnlyRoute() {
  const { is_authenticated, is_checking_session } = use_auth();

  if (is_checking_session) {
    return (
      <section className="page-section narrow-section">
        <StatusCard
          title="Preparando acceso"
          message="Estamos comprobando si ya tienes una sesión iniciada."
          variant="loading"
        />
      </section>
    );
  }

  if (is_authenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;