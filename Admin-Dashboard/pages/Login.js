import { Form, Input, Button, message } from 'antd';
import { login } from '../api/user';
import { setToken } from '../utils/auth';

const Login = () => {
  const onFinish = async (values) => {
    try {
      const res = await login(values);
      setToken(res.token);
      message.success('登录成功');
      window.location.href = '/';
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div style={{ width: 300, margin: '100px auto' }}>
      <h1 style={{ textAlign: 'center' }}>后台管理系统</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};