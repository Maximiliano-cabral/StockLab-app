import React, { useState, useMemo } from 'react';
import { 
    Calendar, Badge, Card, Tag, Row, Col, 
    Statistic, Button, Modal, Form, Input, 
    DatePicker, InputNumber, message, Popconfirm, Spin
} from 'antd';
import { ArrowUpOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import './Salidas.css';
import { useSalidas } from '../../Hooks/useSalidas'; 


dayjs.locale('es');

const Salidas = () => {

    const { salidasPedidos: salidas, addSalida, deleteSalida, isLoading } = useSalidas();

    const hoy = dayjs();
    const [mesActual, setMesActual] = useState(hoy.month()); 
    const [añoActual, setAñoActual] = useState(hoy.year()); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    
    const obtenerNombreMes = (mes) => dayjs().month(mes).format('MMMM');
    const salidasFiltradas = useMemo(() => {
        return salidas.filter(s => {
            const date = dayjs(s.fecha);
            return date.month() === mesActual && date.year() === añoActual;
        });
    }, [salidas, mesActual, añoActual]); 


    const totalSalidas = salidasFiltradas.length;


    const salidasPorDia = useMemo(() => {
        return salidasFiltradas.reduce((acc, salida) => {
            const dia = dayjs(salida.fecha).date();
            acc[dia] = acc[dia] || [];
            acc[dia].push(salida);
            return acc;
        }, {});
    }, [salidasFiltradas]);

    const getListData = (value) => {
        const dia = value.date();
        const salidasDelDia = salidasPorDia[dia] || [];
        
        return salidasDelDia.map(salida => ({ type: 'error', content: `${salida.cliente}` }));
    };

    const renderCalendarCell = (value, info) => {
        if (info.type === 'date') {
            const listData = getListData(value);
            return (
                <ul className="calendar-events-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {listData.map((item, index) => (
                        <li key={index} style={{ fontSize: '8px' }}>
                            <Badge status={item.type} />
                        </li>
                    ))}
                </ul>
            );
        }
        return info.originNode; 
    };

    const onPanelChange = (value) => {
        setMesActual(value.month());
        setAñoActual(value.year());
    };


    const showModal = () => {
        form.setFieldsValue({
            fecha: dayjs().startOf('day'), 
            toneladas: 1, 
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        const fechaSeleccionada = values.fecha;
        
        const nuevaSalida = {
            cliente: values.cliente,
            toneladas: values.toneladas,
            fecha: fechaSeleccionada.toISOString(), 
        };

        try {

            await addSalida(nuevaSalida); 
            message.success(`Salida agregada para ${values.cliente}`);
            handleCancel();
        } catch (e) {
            message.error("Error al guardar la salida en la base de datos.");
            console.error(e);
        }
    };

    const handleDelete = async (idAEliminar) => {
        try {
            await deleteSalida(idAEliminar); 
            message.success('Salida eliminada correctamente');
        } catch (e) {
            message.error("Error al eliminar la salida de la base de datos.");
            console.error(e);
        }
    };
    

    const nombreMesCapitalizado = obtenerNombreMes(mesActual).charAt(0).toUpperCase() + 
                                 obtenerNombreMes(mesActual).slice(1);
                                 
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full pt-10">
                <Spin size="large" tip="Cargando pedidos..." />
            </div>
        );
    }
                                 
    return (
        <div className="salidas-container p-5">
            <h1 className="text-3xl font-bold mb-6">Gestión de Salida de Pedidos</h1>
            
            <Row gutter={[24, 24]}> 

                <Col xs={24} lg={14} xl={14}>
                    <Card 
                        className="calendar-card"
                        title={<span className="card-title">Calendario de Salidas</span>}
                        extra={<Tag color="red">{totalSalidas} pedidos</Tag>}
                        styles={{ body: { padding: '10px' } }}
                    >
                        <div className="calendar-wrapper">
                            <Calendar 
                                cellRender={renderCalendarCell}
                                fullscreen={false}
                                onPanelChange={onPanelChange}
                            />
                        </div>
                    </Card>
                </Col>
                

                <Col xs={24} lg={10} xl={10}>
                    

                    <Card className="stats-card mb-6" styles={{ body: { padding: '20px' } }}>
                        <Statistic
                            title={<span className="stats-title">Salidas de {nombreMesCapitalizado} {añoActual}</span>}
                            value={totalSalidas}
                            prefix={<ArrowUpOutlined />}
                            suffix="pedidos"
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                        />
                    </Card>
                    

                    <Card 
                        className="salidas-card"
                        title={<span className="card-title">Próximas salidas</span>}
                        extra={
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={showModal}
                                size="small"
                                className="add-button"
                            >
                                Agregar
                            </Button>
                        }
                        styles={{ body: { padding: '10px 15px', maxHeight: '350px', overflowY: 'auto' } }}
                    >
                        {totalSalidas === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                No hay salidas programadas para este mes
                            </div>
                        ) : (
                            <ul className="salidas-list">
                                {Object.entries(salidasPorDia)
                                    .sort(([diaA], [diaB]) => parseInt(diaA) - parseInt(diaB))
                                    .map(([dia, salidasDelDia]) => (
                                        <li key={dia} className="dia-item mb-3 pb-2 border-b border-gray-100">
                                            <strong className="text-base">Día {dia}:</strong>
                                            <ul className="clientes-list mt-1">
                                                {salidasDelDia.map((s) => ( 
                                                    <li key={s.id} className="cliente-item flex justify-between items-center py-1">
                                                        <span className="cliente-info text-sm">
                                                            {s.cliente} ({s.toneladas}t)
                                                        </span>
                                                        <Popconfirm
                                                            title="¿Eliminar salida?"
                                                            description={`¿Estás seguro de eliminar el pedido de ${s.cliente}?`}
                                                            onConfirm={() => handleDelete(s.id)} 
                                                            okText="Sí, eliminar"
                                                            cancelText="Cancelar"
                                                        >
                                                            <Button 
                                                                type="text" 
                                                                danger 
                                                                size="small" 
                                                                icon={<DeleteOutlined />} 
                                                                className="opacity-75 hover:opacity-100"
                                                            />
                                                        </Popconfirm>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </Card>
                </Col>
            </Row>
            

            <Modal
                title="Agregar Salida de Pedido"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                className="add-modal"
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Nombre del Cliente" name="cliente" rules={[{ required: true, message: 'Por favor ingrese el nombre del cliente' }]}>
                        <Input placeholder="Ej: Agro S.A."/>
                    </Form.Item>
                    <Form.Item label="Cantidad (Toneladas)" name="toneladas" rules={[{ required: true, type: 'number', min: 0.1, message: 'Cantidad debe ser positiva' }]}>
                        <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} placeholder="Ej: 10.5"/>
                    </Form.Item>
                    <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}>

                        <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block className="add-button mt-4">Guardar Salida</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Salidas;