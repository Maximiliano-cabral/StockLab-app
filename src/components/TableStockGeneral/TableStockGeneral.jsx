import React, { useState } from 'react';
import { Table, Input, Space, Button, Tag, Popconfirm, message, InputNumber, Form } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import './TableStockGeneral.css';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={0} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Ingrese ${title}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TableStockGeneral = ({ data, setData }) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');

    const isEditing = (record) => record.title === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            title: '',
            stock: '',
            ...record,
        });
        setEditingKey(record.title);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.title);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
                message.success('Stock actualizado');
            }
        } catch (errInfo) {
            console.log('Error:', errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = data.filter((item) => item.title !== key);
        setData(newData);
        message.success('Producto eliminado');
    };


    const filteredData = data.filter((item) => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );


    const columns = [
        {
            title: 'Insumo / Producto',
            dataIndex: 'title',
            key: 'title',
            width: '50%', 
            editable: true,
            render: (text) => <span style={{ fontWeight: 500, fontSize: '15px' }}>{text}</span>
        },
        {
            title: 'Stock Actual',
            dataIndex: 'stock',
            key: 'stock',
            width: '30%',
            editable: true,
            render: (stock, record) => {
                const isLow = stock < 50; 
                const color = isLow ? 'error' : 'success';
                const pesoBulto = record.peso_bulto || 0;
                const unidad = record.unidad || 'u.';
                const tipoEnvase = record.tipo_bulto || 'u.';

                let equivalencia = null;
                if (pesoBulto > 0 && stock > 0) {
                    const cantidadBultos = (stock / pesoBulto).toFixed(1).replace('.0', '');
                    equivalencia = (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                            📦 <b>{cantidadBultos} {tipoEnvase}s</b> 
                            <span style={{ fontSize: '11px', color: '#999', marginLeft: '4px' }}>
                                (de {pesoBulto} {unidad})
                            </span>
                        </div>
                    );
                }

                return (
                    <div>
                        <Tag color={color} style={{ fontSize: '15px', padding: '5px 10px', fontWeight: '600' }}>
                            {stock} {unidad}
                        </Tag>
                        {equivalencia}
                    </div>
                );
            },
        },
        {
            title: 'Acciones',
            dataIndex: 'operation',
            width: '20%',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button type="link" onClick={() => save(record.title)} icon={<SaveOutlined />} style={{color: '#52c41a'}} />
                        <Button type="link" onClick={cancel} icon={<CloseOutlined />} danger />
                    </Space>
                ) : (
                    <Space>
                        <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)} icon={<EditOutlined />} />
                        <Popconfirm title="¿Eliminar?" onConfirm={() => handleDelete(record.title)} okText="Sí" cancelText="No">
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) { return col; }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'stock' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="table-stock-container">
            <div style={{ marginBottom: 20 }}>
                <Input
                    placeholder="Buscar insumo químico..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '100%', maxWidth: '400px' }} 
                    allowClear
                />
            </div>
            <Form form={form} component={false}>
                <Table
                    components={{ body: { cell: EditableCell } }}
                    bordered={false}
                    dataSource={filteredData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ pageSize: 8 }}
                    rowKey="title" 
                    scroll={{ x: 'max-content' }}
                />
            </Form>
        </div>
    );
};

export default TableStockGeneral;