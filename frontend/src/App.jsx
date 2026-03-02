import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/authContext';
import LoginPage from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Temporary Dashboard component
const Dashboard = () => {
    const { user, logout } = useAuth(); 
    return (
        <div style={{ padding: 20 }}>
            <h1>Привіт, {user.name}! ({user.role})</h1>
            <button onClick={logout}>Вийти</button>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;