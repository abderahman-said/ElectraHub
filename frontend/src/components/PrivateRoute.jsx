import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Block customers from accessing dashboard/admin routes
    if (user?.access_level === 'customer') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
