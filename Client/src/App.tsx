import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import PostsPage from './pages/admin/PostsPage';
import CalendarPage from './pages/admin/CalendarPage';
import AppLayout from './layouts/AppLayout';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.title =
      location.pathname === '/' || location.pathname === '/admin/login'
        ? 'Tools — Đăng nhập quản trị'
        : 'Tools — Quản trị';
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          <AppLayout route={`#${location.pathname}`}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/tools" element={<Navigate to="/admin/posts" replace />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route
                path="*"
                element={
                  <div className="p-6 text-center">
                    <h1 className="text-xl font-bold mb-2">Không tìm thấy trang</h1>
                    <a href="#/admin" className="text-blue-600 underline">
                      Về tổng quan
                    </a>
                  </div>
                }
              />
            </Routes>
          </AppLayout>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
