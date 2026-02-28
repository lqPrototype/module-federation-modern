import { useNavigate } from '@modern-js/runtime/router';
import {
  Button,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
  Typography,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const releaseEvents = [
  '09:00 完成 remote 组件 smoke test',
  '10:30 host 与 remote-app 联调通过',
  '13:45 host 菜单配置生效',
  '15:20 remote-app 容器健康检查通过',
];

const moduleCards = [
  {
    title: 'Remote 组件中心',
    desc: '按组件粒度集成远端模块，支持运行时替换。',
    path: '/remote',
    tag: 'Component Level',
  },
  {
    title: 'Remote 应用容器',
    desc: '整应用挂载，模拟大规模业务线接入。',
    path: '/remote-app',
    tag: 'App Level',
  },
];

const todoItems = [
  '确认 remote 与 host 的 shared 版本策略',
  '梳理生产环境 remotes 动态注册配置',
  '增加失败重试与兜底页面指标上报',
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card className="hero-banner">
        <Space direction="vertical" size={8}>
          <Tag color="blue">Host Console</Tag>
          <Title level={2} style={{ margin: 0 }}>
            微前端业务总控台
          </Title>
          <Paragraph style={{ marginBottom: 8, maxWidth: 680 }}>
            当前宿主应用统一管理多个远程业务模块，覆盖组件级接入与整应用挂载两类典型场景，支持持续扩展到更大规模的业务域。
          </Paragraph>
          <Space wrap>
            <Button type="primary" onClick={() => navigate('/remote')}>
              前往组件中心
            </Button>
            <Button onClick={() => navigate('/remote-app')}>查看应用容器</Button>
          </Space>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card">
            <Statistic title="接入模块" value={12} suffix="个" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card">
            <Statistic title="今日请求" value={182340} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card">
            <Statistic title="可用性" value={99.96} precision={2} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card">
            <Statistic title="平均延迟" value={189} suffix="ms" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="模块入口">
            <Row gutter={[12, 12]}>
              {moduleCards.map(item => (
                <Col xs={24} md={12} lg={8} key={item.path}>
                  <Card
                    className="module-card"
                    hoverable
                    title={item.title}
                    extra={<Tag color="geekblue">{item.tag}</Tag>}
                    actions={[<span key="open">进入模块</span>]}
                    onClick={() => navigate(item.path)}
                  >
                    <Text type="secondary">{item.desc}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="发布进度">
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div>
                <Text>主干联调</Text>
                <Progress percent={92} />
              </div>
              <div>
                <Text>灰度发布</Text>
                <Progress percent={68} status="active" />
              </div>
              <div>
                <Text>监控覆盖</Text>
                <Progress percent={84} strokeColor="#52c41a" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="今日事件流">
            <Timeline>
              {releaseEvents.map(item => (
                <Timeline.Item key={item}>{item}</Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="待办事项">
            <List
              dataSource={todoItems}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Index;
