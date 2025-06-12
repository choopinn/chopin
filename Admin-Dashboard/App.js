import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={
            <AuthRoute roles={['admin', 'user']}>
              <Dashboard />
            </AuthRoute>
          } />
          <Route path="/users" element={
            <AuthRoute roles={['admin']}>
              <UserList />
            </AuthRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}