import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, AppleOutlined, ToolOutlined } from '@ant-design/icons';

const ProductCards = ({ data = [] }) => {
    

    
    const comestibles = data.filter(p => p.comestible === true).length;
    
    const noComestibles = data.filter(p => p.comestible === false).length;
    
    const totalProductos = data.length;

    return (
        <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24} sm={12} md={8}>
                <Card className="summary-card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                    <Statistic
                        title={<span className="text-gray-600 font-semibold">Total de Productos</span>}
                        value={totalProductos}
                        suffix="productos"
                        valueStyle={{ color: '#1890ff', fontWeight: '700', fontSize: '32px' }}
                        prefix={<ShoppingOutlined className="text-2xl mr-2" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
                <Card className="summary-card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                    <Statistic
                        title={<span className="text-gray-600 font-semibold">Productos Comestibles</span>}
                        value={comestibles}
                        suffix="comestibles" 
                        valueStyle={{ color: '#52c41a', fontWeight: '700', fontSize: '32px' }}
                        prefix={<AppleOutlined className="text-2xl mr-2" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
                <Card className="summary-card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                    <Statistic
                        title={<span className="text-gray-600 font-semibold">Productos No Comestibles</span>}
                        value={noComestibles}
                        suffix="no comestibles" 
                        valueStyle={{ color: '#fa8c16', fontWeight: '700', fontSize: '32px' }}
                        prefix={<ToolOutlined className="text-2xl mr-2" />}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default ProductCards;