import React, { useState } from 'react';
import { 
    Card, Tag, Row, Col, 
    Table, Input, Button, 
    Modal, Form, InputNumber, Select, 
    Popconfirm, Spin, App 
} from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    SearchOutlined, AlertOutlined, MinusOutlined 
} from '@ant-design/icons';
import { useProducts } from '../../Hooks/useProducts'; 
import ProductCards from '../../components/ProductCards/ProductCards';
import './StockGeneral.css'; 

const { Option } = Select;

const StockGeneralContent = () => {

    // 2. INICIALIZAR EL CONTEXTO DE MENSAJES de Ant Design
    const { message } = App.useApp(); 

    const { productos, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
    
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    
    //Estados para el modal de gestión de stock
    const [isStockModalVisible, setIsStockModalVisible] = useState(false);
    const [stockAction, setStockAction] = useState(null); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockForm] = Form.useForm();

    const productosUnicos = [];
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

    const listaLimpia = Array.from(mapaNombres.values());


    const filteredProducts = listaLimpia.filter(p => {
        const nombre = p.nombre || p.title || '';
        return nombre.toLowerCase().includes(searchText.toLowerCase());
    });


    const isStockBajo = (producto) => {
        const stockActual = producto.stock;
        const unidad = producto.unidad;
        
        if (unidad === 'bidon') {
            return stockActual < 5; 
        }
        
        if (unidad === 'tn') {
            return stockActual < 0.5; 
        }

        // Umbral por defecto para 'kg', 'litros', 'cajas', 'u', etc.
        return stockActual < 50; 
    };

    const stockBajoCount = listaLimpia.filter(isStockBajo).length;

    //Función para mostrar el modal de gestión de stock
    const showStockModal = (product, action) => {
        setSelectedProduct(product);
        setStockAction(action);
        stockForm.resetFields();
        setIsStockModalVisible(true);
    };

    //Función para manejar el cambio de stock
    const handleStockChange = async (values) => {
        try {
            const cantidad = Number(values.cantidad);
            let nuevoStock;

            if (stockAction === 'add') {
                nuevoStock = selectedProduct.stock + cantidad;
            } else {
                nuevoStock = Math.max(0, selectedProduct.stock - cantidad);
            }

            await updateProduct(selectedProduct.id, {
                ...selectedProduct,
                stock: nuevoStock
            });

            message.success(
                stockAction === 'add' 
                    ? `✅ Se agregaron ${cantidad} ${selectedProduct.unidad}` 
                    : `✅ Se descontaron ${cantidad} ${selectedProduct.unidad}`
            );
            
            setIsStockModalVisible(false);
            stockForm.resetFields();
        } catch (e) {
            console.error("Error al actualizar stock:", e);
            message.error("❌ Error al actualizar el stock");
        }
    };

    const showModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            form.setFieldsValue({
                ...product,
                nombre: product.nombre || product.title 
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                unidad: 'tn', 
                stock: 0, 
                tipo_bulto: 'bolsa',
                comestible: true,
                peso_bulto: 0
            }); 
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingProduct(null);
        form.resetFields();
    };

    const handleSave = async (values) => {
        try {
            const dataToSave = {
                nombre: values.nombre, 
                stock: Number(values.stock),
                unidad: values.unidad,
                tipo_bulto: values.tipo_bulto,
                peso_bulto: Number(values.peso_bulto || 0),
                comestible: values.comestible
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, dataToSave);
                message.success('✍️ Producto actualizado correctamente');
            } else {
                await addProduct(dataToSave);
                message.success('✅ Se agregó tu nuevo producto'); 
            }
            handleCancel();
        } catch (e) {
            console.error("Error al guardar:", e);
            message.error("❌ Error al guardar en la base de datos");
        }
    };
    
    const handleDelete = async (id) => {
        if (!id) return message.error("Error: ID no válido");
        try {
            await deleteProduct(id);
            message.success('🗑️ Producto eliminado correctamente');
        } catch (e) {
            console.error("Error al eliminar:", e);
            message.error("❌ No se pudo eliminar. Revisa tu conexión.");
        }
    };


    const columns = [
        {
            title: 'Producto',
            key: 'nombre', 
            width: '25%',
            sorter: (a, b) => (a.nombre || a.title || '').localeCompare(b.nombre || b.title || ''),
            render: (_, record) => (
                <span className="product-title-cell font-medium text-gray-700">
                    {record.nombre || record.title || <span className="text-red-300">Sin Nombre</span>}
                    <div className="mobile-info-row">
                        <Tag 
                            color={
                                record.tipo_bulto === 'bolsa' ? 'green' : 
                                record.tipo_bulto === 'caja' ? 'orange' : 
                                record.tipo_bulto === 'bidon' ? 'purple' : 
                                record.tipo_bulto === 'frasco' ? 'blue' :
                                record.tipo_bulto === 'botella' ? 'blue' :
                                'blue'
                            }
                        >
                            {(record.tipo_bulto || 'OTRO').toUpperCase()}
                        </Tag>
                        <Tag color={record.comestible ? 'cyan' : 'red'}>
                            {record.comestible ? 'COMESTIBLE' : 'NO COMESETIBLE'}
                        </Tag>
                    </div>
                </span>
            )
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo_bulto',
            key: 'tipo_bulto',
            width: '12%',
            className: 'desktop-only', 
            render: (text) => (
                <Tag 
                    color={
                        text === 'bolsa' ? 'green' : 
                        text === 'caja' ? 'orange' : 
                        text === 'bidon' ? 'purple' : 
                        text === 'frasco' ? 'blue' :
                        text === 'botella' ? 'blue' :
                        'blue'
                    }
                >
                    {(text || 'OTRO').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Clasificación',
            dataIndex: 'comestible',
            key: 'comestible',
            width: '10%',
            className: 'desktop-only', 
            render: (value) => (
                <Tag color={value ? 'cyan' : 'red'}>
                    {value ? 'COMESTIBLE' : 'NO COMESETIBLE'}
                </Tag>
            ),
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
            width: '12%',
            render: (text, record) => {
                const isLow = isStockBajo(record); 
                return (
                    <div className="stock-cell-wrapper"> 
                        <Tag 
                            color={isLow ? '#f50' : '#87d068'} 
                            style={{ fontSize: '14px', padding: '4px 10px' }}
                        >
                            {text} {record.unidad || 'kg'}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Gestión Stock',
            key: 'gestion_stock',
            width: '18%',
            className: 'desktop-only',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button 
                        type="primary"
                        style={{ backgroundColor: '#52c41a'}}
                        icon={<PlusOutlined />}
                        onClick={() => showStockModal(record, 'add')}
                        size="small"
                    >
                        Agregar
                    </Button>
                    <Button 
                        style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16', color: 'white' }}
                        icon={<MinusOutlined />}
                        onClick={() => showStockModal(record, 'subtract')}
                        size="small"
                    >
                        Descontar
                    </Button>
                </div>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: '23%',
            render: (_, record) => (
                <div className="actions-cell-wrapper">
                    {/* Botones de gestión de stock en móvil */}
                    <div className="flex space-x-2 mb-2 mobile-only">
                        <Button 
                            type="primary"
                            style={{ backgroundColor: '#52c41a', flex: 1 }}
                            icon={<PlusOutlined />}
                            onClick={() => showStockModal(record, 'add')}
                            size="small"
                        >
                            +
                        </Button>
                        <Button 
                            style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16', color: 'white', flex: 1 }}
                            icon={<MinusOutlined />}
                            onClick={() => showStockModal(record, 'subtract')}
                            size="small"
                        >
                            -
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => showModal(record)}
                            size="small"
                        >
                            Editar
                        </Button>
                        <Popconfirm
                            title="Eliminar producto"
                            description="¿Estás seguro? Esta acción no se deshace."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Sí, eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                        >
                            <Button 
                                icon={<DeleteOutlined />} 
                                danger 
                                size="small"
                            >
                                Eliminar
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            ),
        },
    ];
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full pt-20">
                <Spin size="large" tip="Cargando inventario...">
                   <div className="p-10" />
                </Spin>
            </div>
        );
    }

    return (
        <div className="p-6 stock-general-page">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Inventario General</h1>
            
            <ProductCards data={listaLimpia} />

            <Card 
                className="mt-6 shadow-md border-gray-200"
                title={<span className="text-lg font-semibold">Detalle de Productos</span>} 
                extra={
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => showModal(null)}
                        size="large"
                    >
                        Agregar Producto
                    </Button>
                }
            >
                <Row gutter={16} className="mb-6 items-center">
                    <Col xs={24} md={16}>
                        <Input
                            placeholder="🔍 Buscar producto por nombre..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            size="large"
                            allowClear
                        />
                    </Col>
                    <Col xs={24} md={8} className="mt-2 md:mt-0 text-right">
                        {stockBajoCount > 0 && (
                            <Tag 
                                icon={<AlertOutlined />} 
                                color="error" 
                                className="px-3 py-1 text-sm rounded border-red-200 bg-red-50 text-red-600"
                            >
                                ⚠️ <b>{stockBajoCount}</b> productos con stock bajo
                            </Tag>
                        )}
                    </Col>
                </Row>

                <Table 
                    columns={columns} 
                    dataSource={filteredProducts} 
                    rowKey="id"
                    pagination={{ pageSize: 8, showSizeChanger: false, simple: true }}
                />
            </Card>
            <Modal
                title={editingProduct ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        label="Nombre del Producto"
                        name="nombre" 
                        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                    >
                        <Input placeholder="Ej: Citrato de Potasio" size="large" />
                    </Form.Item>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Stock Actual"
                                name="stock"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Unidad"
                                name="unidad"
                                rules={[{ required: true }]}
                            >
                                <Select size="large">
                                    <Option value="kg">Kilos (kg)</Option>
                                    <Option value="tn">Toneladas (tn)</Option> 
                                    <Option value="cajas">Cajas</Option>
                                    <Option value="litros">Litros</Option>
                                    <Option value="bidon">Bidón</Option> 
                                    <Option value="u">Unidades</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Presentación"
                                name="tipo_bulto"
                                rules={[{ required: true }]}
                            >
                                <Select size="large">
                                    <Option value="bolsa">Bolsa</Option>
                                    <Option value="caja">Caja</Option>
                                    <Option value="frasco">Frasco</Option>
                                    <Option value="botella">Botella</Option>
                                    <Option value="bidon">Bidón</Option> 
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Clasificación"
                                name="comestible"
                            >
                                <Select size="large">
                                    <Option value={true}>✅ Comestible</Option>
                                    <Option value={false}>🚫 No Comestible</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item label="Peso aprox. por bulto (Opcional)" name="peso_bulto">
                        <InputNumber style={{ width: '100%' }} placeholder="Ej: 25" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={handleCancel} size="large">Cancelar</Button>
                        <Button type="primary" htmlType="submit" size="large">
                            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {stockAction === 'add' ? (
                            <>
                                <PlusOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                                <span>Agregar Mercadería</span>
                            </>
                        ) : (
                            <>
                                <MinusOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />
                                <span>Descontar Mercadería</span>
                            </>
                        )}
                    </div>
                }
                open={isStockModalVisible}
                onCancel={() => {
                    setIsStockModalVisible(false);
                    stockForm.resetFields();
                }}
                footer={null}
                maskClosable={false}
            >
                {selectedProduct && (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Producto:</p>
                            <p className="font-semibold text-lg">{selectedProduct.nombre || selectedProduct.title}</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500 mb-1">Stock actual:</p>
                            <Tag 
                                color={isStockBajo(selectedProduct) ? '#f50' : '#87d068'} 
                                style={{ fontSize: '16px', padding: '6px 12px' }}
                            >
                                {selectedProduct.stock} {selectedProduct.unidad}
                            </Tag>
                        </div>

                        <Form
                            form={stockForm}
                            layout="vertical"
                            onFinish={handleStockChange}
                        >
                            <Form.Item
                                label={`Cantidad a ${stockAction === 'add' ? 'agregar' : 'descontar'}:`}
                                name="cantidad"
                                rules={[
                                    { required: true, message: 'Ingrese una cantidad' },
                                    { type: 'number', min: 0.01, message: 'Debe ser mayor a 0' }
                                ]}
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    min={0.01}
                                    placeholder={`Ingrese cantidad en ${selectedProduct.unidad}`}
                                    size="large"
                                />
                            </Form.Item>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button 
                                    onClick={() => {
                                        setIsStockModalVisible(false);
                                        stockForm.resetFields();
                                    }}
                                    size="large"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        backgroundColor: stockAction === 'add' ? '#52c41a' : '#fa8c16',
                                        borderColor: stockAction === 'add' ? '#52c41a' : '#fa8c16'
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

const StockGeneral = () => (
    <App>
        <StockGeneralContent />
    </App>
);

export default StockGeneral;