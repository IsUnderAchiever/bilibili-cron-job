import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { fetchUsers, createUser, healthCheck } from "./api/user";
import type { User } from "./types/user";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  // --------------- state ---------------
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [healthLoading, setHealthLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  // --------------- data fetching ---------------
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await fetchUsers();
      setUsers(res.data ?? []);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Load users on first render
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // --------------- handlers ---------------
  const handleHealthCheck = async () => {
    setHealthLoading(true);
    setHealthStatus(null);
    setHealthError(null);
    try {
      const res = await healthCheck();
      setHealthStatus(res.status);
      message.success(`Health check passed: ${res.status}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Health check failed";
      setHealthError(msg);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleCreateUser = async (values: { name: string; email: string }) => {
    setCreateLoading(true);
    try {
      await createUser(values.name, values.email);
      message.success(`User "${values.name}" created successfully!`);
      form.resetFields();
      setModalOpen(false);
      // Reload the user list so the new entry appears
      await loadUsers();
    } catch {
      // Error toast already shown by the axios interceptor
    } finally {
      setCreateLoading(false);
    }
  };

  // --------------- table columns ---------------
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  // --------------- render ---------------
  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* ---- Header ---- */}
      <Header className="flex items-center bg-white shadow-sm px-6">
        <Title level={3} className="!mb-0 text-blue-600">
          Bilibili Cron Job — User Dashboard
        </Title>
      </Header>

      {/* ---- Content ---- */}
      <Content className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* ========== Health Check ========== */}
        <Card
          title="Health Check"
          className="shadow-sm"
          extra={
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={healthLoading}
              onClick={handleHealthCheck}
            >
              Check Health
            </Button>
          }
        >
          <Space direction="vertical" className="w-full">
            {healthStatus && (
              <Tag color="green" className="text-sm px-3 py-1">
                Backend Status: {healthStatus}
              </Tag>
            )}
            {healthError && (
              <Alert type="error" message={healthError} showIcon closable />
            )}
            {!healthStatus && !healthError && (
              <Text type="secondary">Click the button to verify the backend connection.</Text>
            )}
          </Space>
        </Card>

        {/* ========== User List ========== */}
        <Card
          title="User List"
          className="shadow-sm"
          extra={
            <Button
              icon={<ReloadOutlined />}
              loading={usersLoading}
              onClick={loadUsers}
            >
              Refresh
            </Button>
          }
        >
          {usersError && (
            <Alert
              type="error"
              message={usersError}
              showIcon
              closable
              className="mb-4"
              onClose={() => setUsersError(null)}
            />
          )}

          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={usersLoading}
            pagination={false}
            locale={{ emptyText: "No users found — create one below!" }}
            className="mb-4"
          />
        </Card>

        {/* ========== Create User ========== */}
        <Card title="Create User" className="shadow-sm">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Create User
          </Button>

          <Modal
            title="Create New User"
            open={modalOpen}
            onCancel={() => {
              form.resetFields();
              setModalOpen(false);
            }}
            footer={null}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateUser}
              className="mt-4"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter a name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input placeholder="e.g. David" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter an email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="e.g. david@example.com" />
              </Form.Item>

              <Form.Item className="!mb-0 text-right">
                <Space>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setModalOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={createLoading}>
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;
