import React from 'react';
import {
  Card,
  Col,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { createRemoteAppComponent } from '@module-federation/modern-js-v3/react';
import { loadRemote } from '@module-federation/modern-js-v3/runtime';
const { Title, Paragraph } = Typography;

const RemoteAppCreate = createRemoteAppComponent({
  loader: () => loadRemote('remote/app'),
  loading: <div>正在加载远程子应用...</div>,
  fallback: ({ error }) => <div>应用加载失败: {error.message}</div>,
});

const RemoteAppComponent = () => {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size={8}>
          <Tag color="gold">App Level Federation</Tag>
          <Title level={3} style={{ margin: 0 }}>
            远程应用挂载容器
          </Title>
          <Paragraph style={{ margin: 0 }}>
            这里演示整应用级别的接入方式。host
            只负责壳层与上下文，业务页面与路由由远程应用自身维护。
          </Paragraph>
        </Space>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card title="远程应用运行区" className="integration-card">
            <div className="remote-app-frame">
              <RemoteAppCreate basename="/sub-app" />
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default RemoteAppComponent;

