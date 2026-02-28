import { Card, Row, Col, Statistic, Button, Space } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from '@modern-js/runtime/router';
import './index.css';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>欢迎使用 Remote 应用</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={11280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={9320}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="订单数量"
              value={5680}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="增长率"
              value={9.3}
              precision={2}
              suffix="%"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }} title="系统概览">
        <p>这是一个基于 Modern.js 和 Module Federation 的微前端应用示例。</p>
        <p>左侧菜单可以切换不同的页面，展示不同的内容。</p>
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/home/about')}>
            跳转到关于页（/home/about）
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Index;
