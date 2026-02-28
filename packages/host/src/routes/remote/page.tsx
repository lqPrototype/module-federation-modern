import React, { Suspense, useState } from 'react';
import { Alert, Button, Card, Col, Row, Space, Tag, Typography, message } from 'antd';
import Comp from 'remote/Image';
import { loadRemote, registerRemotes } from '@module-federation/modern-js-v3/runtime';
import type { ComponentType } from 'react';

const { Title, Paragraph, Text } = Typography;

const NewRemoteCom = React.lazy(async () => {
  const module = await loadRemote('remote/Image');
  return module as { default: ComponentType };
});

const Index = () => {
  const [showComponent, setShowComponent] = useState(false);

  const replaceRemote = () => {
    registerRemotes(
      [
        {
          name: 'remote',
          entry: 'http://localhost:3053/static/mf-manifest.json',
        },
      ],
      { force: true }
    );

    setShowComponent(true);
    message.success('已触发 remote 运行时替换');
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Tag color="blue">Remote Module</Tag>
          <Title level={3} style={{ margin: 0 }}>
            组件级远程接入中心
          </Title>
          <Paragraph style={{ margin: 0 }}>
            页面演示 host 对远程组件的静态加载与运行时替换。左侧为宿主交互，右侧为远程组件渲染结果。
          </Paragraph>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="integration-card" title="宿主控制面板">
            <Space direction="vertical" size={12}>
              <Button
                type="primary"
                id="remote-local-button"
                onClick={() => message.info('[Remote Page] Host interactive works')}
              >
                验证宿主交互
              </Button>
              <Button id="remote-replace-button" onClick={replaceRemote}>
                触发远程地址替换
              </Button>
              <Alert
                type="info"
                showIcon
                message="remote 替换策略"
                description="点击后会通过 registerRemotes(force: true) 强制刷新 remote 定义，随后懒加载新组件。"
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="integration-card" title="远程组件渲染区">
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <div>
                <Text type="secondary">静态组件</Text>
                <div className="remote-preview">
                  <Comp />
                </div>
              </div>
              <div>
                <Text type="secondary">运行时替换后组件</Text>
                <div className="remote-preview">
                  <Suspense fallback={<div>Loading remote component...</div>}>
                    {showComponent ? <NewRemoteCom /> : <Text>等待触发替换</Text>}
                  </Suspense>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Index;
