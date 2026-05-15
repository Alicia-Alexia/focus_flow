import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Importe seus componentes
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard'; 
import { authService } from './services/auth';
import type { JSX } from 'react/jsx-dev-runtime';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = authService.getUser();
  return user ? children : <Navigate to="/login" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}