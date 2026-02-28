import { Card, Descriptions, Avatar, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const Index = () => (
  <div>
    <Card title="关于我们" style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <h2 style={{ marginTop: 16 }}>Remote 应用</h2>
          <p style={{ color: '#666' }}>基于 Modern.js 和 Module Federation 构建</p>
        </div>

        <Descriptions title="应用信息" bordered column={1}>
          <Descriptions.Item label="应用名称">Remote Application</Descriptions.Item>
          <Descriptions.Item label="版本">0.1.36</Descriptions.Item>
          <Descriptions.Item label="框架">Modern.js v3.0.1</Descriptions.Item>
          <Descriptions.Item label="UI 组件库">Ant Design v4.24.15</Descriptions.Item>
          <Descriptions.Item label="端口">3053</Descriptions.Item>
          <Descriptions.Item label="描述">
            这是一个微前端远程应用，可以被其他应用通过 Module Federation 加载和使用。
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>

    <Card title="联系方式">
      <Space direction="vertical" size="middle">
        <div>
          <MailOutlined style={{ marginRight: 8 }} />
          <span>邮箱: contact@example.com</span>
        </div>
        <div>
          <PhoneOutlined style={{ marginRight: 8 }} />
          <span>电话: +86 123-4567-8900</span>
        </div>
        <div>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          <span>地址: 中国北京市朝阳区</span>
        </div>
      </Space>
    </Card>
  </div>
);

export default Index;
