
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      // Removendo `credentials` para evitar problemas de CORS enquanto testamos
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          expiresInMins: 30,
        }),
      });

      // Se a resposta for vazia ou houve erro de rede, fetch lança ou retornará status não-ok
      if (!res) throw new Error('Nenhuma resposta recebida do servidor');

      // Verificar status HTTP
      if (!res.ok) {
        // Tentar ler o corpo da resposta para uma mensagem mais detalhada
        let text: string;
        try {
          const json = await res.json();
          text = JSON.stringify(json);
        } catch (e) {
          text = await res.text();
        }
        throw new Error(`Erro HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log('Login response:', data);

      // Persistir token/local state para manter sessão
      try {
        const token = (data as any)?.token ?? JSON.stringify(data);
        localStorage.setItem('authToken', token);
        // Notificar outras partes da app que o auth mudou
        window.dispatchEvent(new Event('authChange'));
      } catch (e) {
        console.warn('Não foi possível persistir token:', e);
      }

  // Se a página anterior (protected) pediu redirecionamento, navegue para lá.
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  navigate(from);
    } catch (err: any) {
      // Mostra mensagem amigável, e loga erro completo no console
      const message = err?.message || 'Erro desconhecido ao tentar conectar';
      setError(message);
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Entrar</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="login-label">Usuário</label>
          <input
            className="login-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            required
          />

          <label htmlFor="password" className="login-label">Senha</label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-button" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
