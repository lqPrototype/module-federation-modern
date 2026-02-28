import { Card, Form, Input, Button, Switch, Select, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
    message.success('设置保存成功');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统设置</h2>

      <Card title="基本设置" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'Remote 应用',
            siteUrl: 'http://localhost:3053',
            language: 'zh-CN',
            timezone: 'Asia/Shanghai',
            enableNotifications: true,
            enableAnalytics: false,
          }}
        >
          <Form.Item
            name="siteName"
            label="站点名称"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="siteUrl"
            label="站点地址"
            rules={[{ required: true, message: '请输入站点地址' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="站点描述">
            <TextArea rows={4} placeholder="请输入站点描述" />
          </Form.Item>

          <Divider />

          <Form.Item name="language" label="语言">
            <Select>
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
              <Option value="ja-JP">日本語</Option>
            </Select>
          </Form.Item>

          <Form.Item name="timezone" label="时区">
            <Select>
              <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
              <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
              <Option value="Europe/London">英国时间 (UTC+0)</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item name="enableNotifications" label="启用通知" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="enableAnalytics" label="启用数据分析" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="高级设置">
        <Form layout="vertical">
          <Form.Item name="cacheEnabled" label="启用缓存" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item name="debugMode" label="调试模式" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="maintenanceMode" label="维护模式" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
