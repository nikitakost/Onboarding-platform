import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/authContext';
import { CustomThemeProvider } from './context/ThemeContext';

import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import VibeTestPage from './pages/VibeTestPage';
import RegisterPage from './pages/RegisterPage';
import WelcomeLetterPage from './pages/WelcomeLetterPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Поки йде перевірка токена - показуємо нічого (або спінер)
  if (loading) return null; 

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <CustomThemeProvider>
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="welcome" element={<WelcomeLetterPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="vibe-test" element={<VibeTestPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
