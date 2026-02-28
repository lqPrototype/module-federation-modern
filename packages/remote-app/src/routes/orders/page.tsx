import { Table, Tag, Space, Button, Badge } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface OrderType {
  key: string;
  orderNo: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const Orders = () => {
  const dataSource: OrderType[] = [
    {
      key: '1',
      orderNo: 'ORD-2024-001',
      customer: '张三',
      product: 'iPhone 15 Pro',
      amount: 7999,
      status: 'completed',
      date: '2024-02-20',
    },
    {
      key: '2',
      orderNo: 'ORD-2024-002',
      customer: '李四',
      product: 'MacBook Pro',
      amount: 12999,
      status: 'processing',
      date: '2024-02-21',
    },
    {
      key: '3',
      orderNo: 'ORD-2024-003',
      customer: '王五',
      product: 'AirPods Pro',
      amount: 1999,
      status: 'pending',
      date: '2024-02-22',
    },
    {
      key: '4',
      orderNo: 'ORD-2024-004',
      customer: '赵六',
      product: 'iPad Air',
      amount: 4999,
      status: 'completed',
      date: '2024-02-23',
    },
    {
      key: '5',
      orderNo: 'ORD-2024-005',
      customer: '钱七',
      product: 'Apple Watch',
      amount: 2999,
      status: 'cancelled',
      date: '2024-02-24',
    },
  ];

  const statusConfig = {
    pending: { color: 'default', text: '待处理' },
    processing: { color: 'processing', text: '处理中' },
    completed: { color: 'success', text: '已完成' },
    cancelled: { color: 'error', text: '已取消' },
  };

  const columns: ColumnsType<OrderType> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusConfig) => (
        <Badge status={statusConfig[status].color as any} text={statusConfig[status].text} />
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>订单列表</h2>
      </div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default Orders;
