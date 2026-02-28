import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface UserType {
  key: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<UserType[]>([
    {
      key: '1',
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
    },
    {
      key: '2',
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: '用户',
      status: 'active',
    },
    {
      key: '3',
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      role: '用户',
      status: 'inactive',
    },
  ]);

  const showModal = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue(user);
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        setDataSource(
          dataSource.map((item) =>
            item.key === editingUser.key ? { ...item, ...values } : item
          )
        );
        message.success('用户更新成功');
      } else {
        const newUser: UserType = {
          key: String(dataSource.length + 1),
          id: dataSource.length + 1,
          ...values,
          status: 'active',
        };
        setDataSource([...dataSource, newUser]);
        message.success('用户添加成功');
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (key: string) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
    message.success('用户删除成功');
  };

  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '激活' : '未激活'}
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
            title="确定要删除这个用户吗？"
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
        <h2>用户管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          添加用户
        </Button>
      </div>

      <Table columns={columns} dataSource={dataSource} />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请输入角色' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
