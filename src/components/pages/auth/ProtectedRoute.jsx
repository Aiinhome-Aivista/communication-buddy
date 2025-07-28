import { Navigate } from 'react-router';
import { useAuth } from '../../../provider/AuthProvider';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" />;
}
