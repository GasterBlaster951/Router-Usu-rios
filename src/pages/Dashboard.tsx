import { Link, Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/dashboard/Perfil">Perfil</Link> |
        <Link to="/dashboard/Configuracoes">Configurações</Link>
      </nav>

      {/* Aqui as rotas filhas serão renderizadas */}
      <Outlet />
    </div>);
}