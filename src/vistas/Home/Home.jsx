import React, { useMemo } from 'react'; 
import { 
    Card, Tag, Row, Col, 
    Statistic, Spin
} from 'antd';
import { 
    ArrowUpOutlined, 
    AlertOutlined, 
    CodeSandboxOutlined, 
    DeleteOutlined       
} from '@ant-design/icons';
import ProductCards from '../../components/ProductCards/ProductCards'; 
import './Home.css';
import { useProducts } from '../../Hooks/useProducts'; 
import { useSalidas } from '../../Hooks/useSalidas';
import { useBarriles } from '../../Hooks/useBarriles'; 

import dayjs from 'dayjs';

const Home = () => {

    const { productos, isLoading: isProductsLoading } = useProducts(); 
    
    const { salidasPedidos, isLoading: isSalidasLoading } = useSalidas();

    const { metal, plastico, loading: isBarrilesLoading } = useBarriles();

    const productosLimpios = useMemo(() => {
        const mapaNombres = new Map();

        productos.forEach(prod => {
            const nombreReal = prod.nombre || prod.title || 'Sin Nombre';
            const key = nombreReal.toLowerCase().trim();

            if (mapaNombres.has(key)) {
                const existente = mapaNombres.get(key);
                if (prod.stock > existente.stock) {
                    mapaNombres.set(key, prod);
                }
            } else {
                mapaNombres.set(key, prod);
            }
        });

        return Array.from(mapaNombres.values());
    }, [productos]); 

    const stockBajoCount = productosLimpios.filter(p => p.stock < 50).length;
    const hoy = dayjs().startOf('day');
    const pedidosPendientesCount = salidasPedidos.filter(s => dayjs(s.fecha).isAfter(hoy)).length;
    console.log('🏠 Home - Total Limpio:', productosLimpios.length);
    if (isProductsLoading || isSalidasLoading || isBarrilesLoading) {
        return (
            <div className="flex justify-center items-center h-full pt-10">
                <Spin size="large" tip="Cargando resumen de datos...">
                    <div style={{ padding: '50px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }} />
                </Spin>
            </div>
        );
    }

    return (
        <div className="home-container p-6">
            <h1 className="text-3xl font-bold mb-6">Resumen del Inventario</h1>
            <ProductCards data={productosLimpios} />
            <Row gutter={[24, 24]} className="mt-8"> 
                <Col xs={24} md={12} lg={8}>
                    <Card className="stats-card shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title={<span className="stats-title">Alertas de Stock</span>}
                            value={stockBajoCount}
                            prefix={<AlertOutlined />}
                            suffix="productos"
                        />
                         {stockBajoCount > 0 && <Tag color="red" className="mt-2">¡Revisar!</Tag>}
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card className="stats-card shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title={<span className="stats-title">Pedidos Pendientes</span>}
                            value={pedidosPendientesCount}
                            prefix={<ArrowUpOutlined />}
                            suffix="pedidos"
                        />
                         <Tag color="green" className="mt-2">Próximas salidas</Tag>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card className="stats-card shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title={<span className="stats-title">Total en Inventario</span>}
                            value={productosLimpios.length} 
                            suffix="productos"
                        />
                         <Tag color="blue" className="mt-2">Registro único</Tag>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="stats-card shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title={<span className="stats-title">Barriles Metal</span>}
                            value={metal} 
                            prefix={<CodeSandboxOutlined />}
                            suffix="vacíos"
                        />
                         <Tag color="geekblue" className="mt-2">Envases Activos</Tag>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={8}>
                    <Card className="stats-card shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title={<span className="stats-title">Barriles Plástico</span>}
                            value={plastico} 
                            prefix={<DeleteOutlined />}
                            suffix="vacíos"
                        />
                         <Tag color="cyan" className="mt-2">Envases Activos</Tag>
                    </Card>
                </Col>

            </Row>
        </div>
    );
};

export default Home;