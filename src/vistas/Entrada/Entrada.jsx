import React, { useState } from 'react';
import { Form, Select, InputNumber, Input, Button, Card, message, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { db } from '../../components/Data/DataFireBase'; 
import { useProducts } from '../../Hooks/useProducts'; 
import './Entrada.css';
import { doc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

const { Option } = Select;

const Entradas = () => {
    const [form] = Form.useForm();
    const { productos, isLoading } = useProducts(); 
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { productoId, cantidad, notas } = values;


            const productoRef = doc(db, "productos", productoId);


            await updateDoc(productoRef, {
                stock: increment(cantidad)
            });


            await addDoc(collection(db, "historial_entradas"), {
                productoId,
                cantidad,
                notas: notas || '', 
                fecha: new Date().toISOString(),
                tipo: 'INGRESO'
            });

            message.success(`¡Stock actualizado! Se agregaron ${cantidad} unidades.`);
            form.resetFields(); 
            
        } catch (error) {
            console.error("Error al ingresar mercadería:", error);
            message.error("Hubo un error al actualizar el stock.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="entradas-page p-6 max-w-2xl mx-auto">
            <Card 
                title={<><PlusCircleOutlined /> Ingreso de Mercadería</>} 
                className="shadow-md"
            >
                <p className="text-gray-500 mb-4">
                    Selecciona un producto y la cantidad que llegó para sumarla al inventario.
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    
                    <Form.Item
                        name="productoId"
                        label="Producto"
                        rules={[{ required: true, message: 'Por favor selecciona un producto' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Busca por nombre..."
                            loading={isLoading}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {productos.map(prod => (
    <Option key={prod.id} value={prod.id}>
        
        {`${prod.nombre || prod.name || prod.title || "Sin Nombre"} (Stock: ${prod.stock})`}
    </Option>
))}
                        </Select>
                    </Form.Item>

                    
                    <Form.Item
                        name="cantidad"
                        label="Cantidad a ingresar"
                        rules={[
                            { required: true, message: 'Ingresa la cantidad' },
                            { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                        ]}
                    >
                        <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="Ej: 50" 
                            size="large"
                        />
                    </Form.Item>
                    

                    <Form.Item name="notas" label="Notas / Proveedor (Opcional)">

                        <Input 
                             placeholder="Ej: Compra a Mayorista X"
                             size="large"
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            size="large"
                            className="bg-green-600 hover:bg-green-500 border-green-600"
                        >
                            Actualizar Stock
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Entradas;