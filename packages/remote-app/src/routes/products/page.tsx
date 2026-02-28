import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ProductType {
  key: string;
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'out_of_stock';
}

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<ProductType[]>([
    {
      key: '1',
      id: 1,
      name: 'iPhone 15 Pro',
      category: '手机',
      price: 7999,
      stock: 50,
      status: 'available',
    },
    {
      key: '2',
      id: 2,
      name: 'MacBook Pro',
      category: '电脑',
      price: 12999,
      stock: 30,
      status: 'available',
    },
    {
      key: '3',
      id: 3,
      name: 'AirPods Pro',
      category: '耳机',
      price: 1999,
      stock: 0,
      status: 'out_of_stock',
    },
  ]);

  const showModal = (product?: ProductType) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue(product);
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const status = values.stock > 0 ? 'available' : 'out_of_stock';
      if (editingProduct) {
        setDataSource(
          dataSource.map((item) =>
            item.key === editingProduct.key ? { ...item, ...values, status } : item
          )
        );
        message.success('产品更新成功');
      } else {
        const newProduct: ProductType = {
          key: String(dataSource.length + 1),
          id: dataSource.length + 1,
          ...values,
          status,
        };
        setDataSource([...dataSource, newProduct]);
        message.success('产品添加成功');
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (key: string) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
    message.success('产品删除成功');
  };

  const columns: ColumnsType<ProductType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toLocaleString()}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? '有货' : '缺货'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>产品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加产品
        </Button>
      </div>

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title={editingProduct ? '编辑产品' : '添加产品'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入分类' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
