// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/DataFireBase';
import { Form, Input, Button, Card, Alert, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import './Login.css';

const { Title, Text } = Typography;
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('El formato del email no es válido');
          break;
        case 'auth/user-disabled':
          setError('Esta cuenta ha sido deshabilitada');
          break;
        case 'auth/user-not-found':
          setError('No existe una cuenta con este email');
          break;
        case 'auth/wrong-password':
          setError('Contraseña incorrecta');
          break;
        case 'auth/invalid-credential':
          setError('Email o contraseña incorrectos');
          break;
        default:
          setError('Error al iniciar sesión. Intenta nuevamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <Card className="login-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-circle">
                <span className="logo-text">SL</span>
              </div>
            </div>
            <Title level={2} className="login-title">StockLab</Title>
            <Text type="secondary">Sistema de Gestión de Inventario</Text>
          </div>

          {error && (
            <Alert
              message="Error al iniciar sesión"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor ingresa tu email' },
                { type: 'email', message: 'Ingresa un email válido' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Contraseña"
              rules={[
                { required: true, message: 'Por favor ingresa tu contraseña' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                block
                size="large"
                className="login-button"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Form.Item>
          </Form>
          <div className="login-footer">
            <Text type="secondary" style={{ fontSize: '12px' }}>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;