import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', position: '', hrCode: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/auth/register', formData);
      toast.success('Реєстрація успішна! Тепер ви можете увійти.');
      navigate('/login'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Помилка при реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderRadius: 2 }}>
        
        <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Створити акаунт
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth label="Ваше ім'я" autoFocus
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="normal" required fullWidth label="Email адреса" type="email"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="normal" required fullWidth label="Пароль" type="password"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            margin="normal" fullWidth label="Посада (необов'язково)"
            value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
          <TextField
            margin="normal" fullWidth label="HR Код (тільки для менеджерів)" type="password"
            value={formData.hrCode} onChange={(e) => setFormData({ ...formData, hrCode: e.target.value })}
            helperText="Залиште порожнім, якщо ви співробітник"
          />
          
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </Button>

          <Divider sx={{ my: 2 }} />
          
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Вже маєте акаунт?{' '}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Увійти
              </Link>
            </Typography>
          </Box>

        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;