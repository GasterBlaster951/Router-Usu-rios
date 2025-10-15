import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Inicio from "./pages/Inicio";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Usuario from "./pages/Usuario";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/dashboard/Perfil";
import Configuracoes from "./pages/dashboard/Configuracoes";
import Login from "./pages/Login";

function AppInner() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('authToken');
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };
    window.addEventListener('authChange', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('authChange', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('authChange'));
    } catch (e) {
      console.warn('Erro ao limpar token:', e);
    }
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/">Início</Link>
          </li>
          <li>
            <Link to="/sobre">Sobre</Link>
          </li>
          <li>
            <Link to="/contato">Contato</Link>
          </li>
          {!isAuthenticated ? (
            <li>
              <Link to="/login">Entrar</Link>
            </li>
          ) : (
            <li>
              <button className="logout-button" onClick={handleLogout}>Sair</button>
            </li>
          )}
        </ul>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/usuario/:id" element={<Usuario />} />

          {/* Protege as rotas do dashboard */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          >
            <Route path="perfil" element={<Perfil />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  let isAuthenticated = false;
  try {
    isAuthenticated = !!localStorage.getItem('authToken');
  } catch (e) {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    // Redireciona para login preservando a rota de origem
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
