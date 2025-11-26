import React from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CodeSandboxOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UseAuth from '../../Hooks/useAuth';
import './SideBar.css';

const { Sider } = Layout;

const SideBar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const { signOut } = UseAuth(); 

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: '/stock',
            icon: <AppstoreOutlined />,
            label: 'Stock General',
        },
        {
            key: '/entradas',
            icon: <ShoppingCartOutlined />,
            label: 'Entrada de Mercadería',
        },
        {
            key: '/salidas',
            icon: <BarChartOutlined />,
            label: 'Salida de Pedidos',
        },
        {
            key: '/barriles', 
            icon: <CodeSandboxOutlined />, 
            label: 'Stock Barriles',
        },
        {
            key: 'logout', 
            icon: <LogoutOutlined />,
            label: 'Cerrar Sesión',
            danger: true,
        },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            signOut(); 
        } else {
            navigate(key);
        }
    };

    return (
        <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            width={250}
            collapsedWidth={80}
            className="custom-sidebar"
            breakpoint="lg"
            onBreakpoint={(broken) => {
                if (broken) {
                    setCollapsed(true);
                }
            }}
        >
            <div className="sidebar-header">
                <div className="logo">
                    {collapsed ? 'SL' : 'StockLab'}
                </div>
                <div 
                    className="collapse-btn" 
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
            </div>

            <Menu
                mode="inline"
                className="custom-menu"
                items={menuItems}
                onClick={handleMenuClick}
            />
        </Sider>
    );
};

export default SideBar;