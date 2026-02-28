import { Table, Tag, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === '管理员') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>编辑</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
    tags: ['开发', '前端'],
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
    tags: ['管理员'],
  },
  {
    key: '3',
    name: '王五',
    age: 28,
    address: '深圳市南山区',
    tags: ['设计', 'UI/UX'],
  },
  {
    key: '4',
    name: '赵六',
    age: 35,
    address: '杭州市西湖区',
    tags: ['后端', '架构师'],
  },
  {
    key: '5',
    name: '钱七',
    age: 29,
    address: '广州市天河区',
    tags: ['测试', 'QA'],
  },
];

const Index = () => {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>用户数据表格</h2>
        <Button type="primary">添加用户</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Index;
