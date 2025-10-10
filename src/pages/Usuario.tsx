import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Interfaces para tipar o objeto do usuário
interface Name {
  firstname: string;
  lastname: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  name: Name;
}

function Usuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/users/${id}`);
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, [id]);

  return (
    <div>
      <h1>Usuários ID: {id}</h1>
      <p>Esta é a página de usuários do site.</p>
      {usuario ? (
        <div>
          <h2>{usuario.name.firstname} {usuario.name.lastname}</h2>
          <p>Email: {usuario.email}</p>
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}
    </div>
  );
}

export default Usuario;