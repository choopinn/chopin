import { useState } from 'react';
import { Table, Button, Input, Space, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import UserForm from '../components/UserForm';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../api/user';

const UserList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      });
      setData(res.data);
      setPagination({
        ...pagination,
        total: res.total,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ keyword: value });
    fetchUsers({ keyword: value });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchUsers({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    message.success('删除成功');
    fetchUsers();
  };

  const handleSubmit = async (values) => {
    if (currentRecord) {
      await updateUser(currentRecord.id, values);
      message.success('更新成功');
    } else {
      await createUser(values);
      message.success('创建成功');
    }
    setFormVisible(false);
    fetchUsers();
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => {
              setCurrentRecord(record);
              setFormVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该用户?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索用户"
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentRecord(null);
            setFormVisible(true);
          }}
        >
          添加用户
        </Button>
      </Space>
      
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />
      
      <UserForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleSubmit}
        initialValues={currentRecord}
      />
    </div>
  );
};