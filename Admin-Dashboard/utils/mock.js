import Mock from 'mockjs';

Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body);
  
  if (username === 'admin' && password === 'admin123') {
    return {
      code: 200,
      data: {
        token: 'admin-token',
        role: 'admin',
      },
    };
  } else if (username === 'user' && password === 'user123') {
    return {
      code: 200,
      data: {
        token: 'user-token',
        role: 'user',
      },
    };
  }
  
  return {
    code: 401,
    message: '用户名或密码错误',
  };
});

// 用户数据模拟
const userList = Mock.mock({
  'list|100': [{
    'id|+1': 1,
    'username': '@name',
    'email': '@email',
    'role|1': ['admin', 'user'],
    'status|1': ['active', 'inactive'],
    'createTime': '@datetime',
  }]
}).list;

Mock.mock(/\/api\/users/, 'get', (options) => {
  const { url } = options;
  const params = new URLSearchParams(url.split('?')[1]);
  
  const page = parseInt(params.get('page')) || 1;
  const pageSize = parseInt(params.get('pageSize')) || 10;
  const keyword = params.get('keyword');
  
  let filteredList = [...userList];
  
  // 搜索过滤
  if (keyword) {
    filteredList = filteredList.filter(item => 
      item.username.includes(keyword) || 
      item.email.includes(keyword)
  }
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filteredList.slice(start, end);
  
  return {
    code: 200,
    data,
    total: filteredList.length,
  };
});