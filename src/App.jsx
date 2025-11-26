import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
// Importaciones de Autenticación
import UseAuth from './Hooks/useAuth';
import Login from './components/Login/Login'; 
// Importaciones de Vistas
import MainLayout from './components/MainLayout/MainLayout'; 
import Home from './vistas/Home/Home'; 
import StockGeneral from './vistas/StockGeneral/StockGeneral'; 
import Salidas from './vistas/Salida/Salidas'; 
import Entradas from './vistas/Entrada/entada';
import StockBarriles from './vistas/StockBarriles/StockBarriles';


const ProtectedRoutes = ({ user }) => {
  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}> 
        <Route index element={<Home />} /> 
        <Route path="stock" element={<StockGeneral />} /> 
        <Route path="entradas" element={<Entradas />} />
        <Route path="salidas" element={<Salidas />} />
        <Route path="barriles" element={<StockBarriles />} />
      </Route>
      <Route path="/login" element={<Home />} />
      <Route path="*" element={<h2>404 Página No Encontrada</h2>} />
    </Routes>
  );
};

function App() {
  const { user, isLoading } = UseAuth();

  if (isLoading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Cargando estado de autenticación...</p>
      </div>
    );
  }

  return (
    <Routes>
      {user === null && <Route path="*" element={<Login />} />}
      {user !== null && (
        <Route path="/*" element={<ProtectedRoutes user={user} />} />
      )}
    </Routes>
  );
}

export default App;