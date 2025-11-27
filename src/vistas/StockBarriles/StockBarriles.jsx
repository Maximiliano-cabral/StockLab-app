import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, message, Spin } from 'antd';
import { 
    CodeSandboxOutlined, 
    DeleteOutlined,      
    PlusOutlined, 
    MinusOutlined 
} from '@ant-design/icons';
import { db } from '../../components/Data/DataFireBase'; 
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import './StockBarriles.css';

const StockBarriles = () => {
    const [metal, setMetal] = useState(0);
    const [plastico, setPlastico] = useState(0);
    const [loading, setLoading] = useState(true);
    const [metalPulse, setMetalPulse] = useState(false);
    const [plasticoPulse, setPlasticoPulse] = useState(false);

    useEffect(() => {
        const metalRef = doc(db, 'barriles_vacios', 'metal');
        const plasticoRef = doc(db, 'barriles_vacios', 'plastico');
        const inicializarDb = async () => {
            const metalSnap = await getDoc(metalRef);
            const plasticoSnap = await getDoc(plasticoRef);

            if (!metalSnap.exists()) await setDoc(metalRef, { cantidad: 0 });
            if (!plasticoSnap.exists()) await setDoc(plasticoRef, { cantidad: 0 });
        };

        inicializarDb();
        
        const unsubMetal = onSnapshot(metalRef, (doc) => {
            if (doc.exists()) {
                const newMetal = doc.data().cantidad;
                if (!loading && newMetal !== metal) {
                    setMetalPulse(true);
                    setTimeout(() => setMetalPulse(false), 400); 
                }
                setMetal(newMetal);
            }
        });
        
        const unsubPlastico = onSnapshot(plasticoRef, (doc) => {
            if (doc.exists()) {
                const newPlastico = doc.data().cantidad;
                if (!loading && newPlastico !== plastico) {
                    setPlasticoPulse(true);
                    setTimeout(() => setPlasticoPulse(false), 400); 
                }
                setPlastico(newPlastico);
                setLoading(false);
            }
        });

        return () => {
            unsubMetal();
            unsubPlastico();
        };
    }, [loading, metal, plastico]);

    const modificarStock = async (tipo, cantidad) => {
        const ref = doc(db, 'barriles_vacios', tipo);
        try {
            const currentStock = tipo === 'metal' ? metal : plastico;
            
            if (cantidad < 0 && currentStock === 0) {
                return message.warning("No tienes stock para descontar.");
            }

            if (cantidad < 0 && currentStock + cantidad < 0) {
                 await updateDoc(ref, {
                    cantidad: 0
                });
                return message.warning("El stock no puede ser negativo. Establecido a 0.");
            }

            await updateDoc(ref, {
                cantidad: increment(cantidad)
            });
            
            message.success(cantidad > 0 ? "Barril agregado" : "Barril descontado");
        } catch (error) {
            console.error(error);
            message.error("Error al actualizar");
        }
    };

    if (loading) return <div className="spinner-container"><Spin size="large" /></div>;

    return (
        <div className="barriles-container">
            <h1 className="titulo-pagina">Stock de Barriles Vacíos</h1>
            
            <Row gutter={[24, 24]} justify="center">

                <Col xs={24} md={10}>
                    <Card className="card-barril card-metal" hoverable>
                        <div className="icon-wrapper metal-icon">
                            <CodeSandboxOutlined />
                        </div>
                        <Statistic 
                            title="Barriles de METAL" 
                            value={metal} 
                            suffix="unidades"
                            valueStyle={{ fontWeight: 'bold' }}
                            className={metalPulse ? 'metal-value stock-update-pulse' : 'metal-value'}
                        />
                        <div className="acciones-buttons">
                            <Button 
                                shape="circle" 
                                icon={<MinusOutlined />} 
                                size="large"
                                onClick={() => modificarStock('metal', -1)}
                            />
                            <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<PlusOutlined />} 
                                size="large"
                                className="btn-sumar-metal"
                                onClick={() => modificarStock('metal', 1)}
                            />
                        </div>
                    </Card>
                </Col>
                
                
                <Col xs={24} md={10}>
                    <Card className="card-barril card-plastico" hoverable>
                        <div className="icon-wrapper plastico-icon">
                            <DeleteOutlined /> 
                        </div>
                        <Statistic 
                            title="Barriles de PLÁSTICO" 
                            value={plastico} 
                            suffix="unidades"
                            valueStyle={{ fontWeight: 'bold' }}
                            className={plasticoPulse ? 'plastico-value stock-update-pulse' : 'plastico-value'}
                        />
                        <div className="acciones-buttons">
                            <Button 
                                shape="circle" 
                                icon={<MinusOutlined />} 
                                size="large"
                                onClick={() => modificarStock('plastico', -1)}
                            />
                            <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<PlusOutlined />} 
                                size="large"
                                className="btn-sumar-plastico"
                                onClick={() => modificarStock('plastico', 1)}
                            />
                        </div>
                    </Card>
                </Col>

            </Row>
        </div>
    );
};

export default StockBarriles;