import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../provider/AuthProvider';

export default function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}