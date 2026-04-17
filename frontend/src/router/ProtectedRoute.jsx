import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { use_auth } from '../context/AuthContext';
import StatusCard from '../components/common/StatusCard';

function ProtectedRoute() {
  const { is_authenticated, is_checking_session } = use_auth();
  const location = useLocation();

  if (is_checking_session) {
    return (
      <section className="page-section narrow-section">
        <StatusCard
          title="Verificando acceso"
          message="Estamos validando tu sesión antes de abrir la consola privada."
          variant="loading"
        />
      </section>
    );
  }

  if (!is_authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;