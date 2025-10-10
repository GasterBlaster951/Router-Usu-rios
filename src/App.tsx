import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Contato from './pages/Contato'
import NotFound from './pages/NotFound'
import Usuario from './pages/Usuario'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/usuario/:id" element={<Usuario />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
