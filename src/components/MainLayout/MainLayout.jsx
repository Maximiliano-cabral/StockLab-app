import React, { useState } from 'react';
import { Layout, Button, Drawer, Grid } from 'antd';
import { Outlet } from 'react-router'; 
import { MenuOutlined } from '@ant-design/icons';
import SideBar from '../SideBar/SideBar';
import '../../App.css';  

const { Content } = Layout;
const { useBreakpoint } = Grid; 
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const screens = useBreakpoint();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {screens.md && (
        <div style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 10 }}>
           <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      )}
      {!screens.md && (
        <Drawer
            title="Menú"
            placement="left"
            onClose={() => setMobileOpen(false)}
            open={mobileOpen}
            styles={{ body: { padding: 0 } }} 
            width={250}
        >
            <div onClick={() => setMobileOpen(false)}>
                <SideBar collapsed={false} setCollapsed={() => {}} />
            </div>
        </Drawer>
      )}
      <Layout 
        style={{ 

          marginLeft: !screens.md ? 0 : (collapsed ? '80px' : '250px'),
          transition: 'margin-left 0.2s',
          background: '#f5f5f5' 
        }}
      >
        {!screens.md && (
            <div style={{ 
                padding: '16px', 
                background: '#fff', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 99
            }}>
                <Button 
                    icon={<MenuOutlined />} 
                    onClick={() => setMobileOpen(true)} 
                    size="large"
                />
                <span style={{ marginLeft: '16px', fontWeight: 'bold', fontSize: '18px' }}>
                    StockLab
                </span>
            </div>
        )}

        <Content 
          style={{ 
            padding: !screens.md ? '16px' : '24px', 
            minHeight: '100vh',
            width: '100%',
            overflowX: 'hidden' 
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;