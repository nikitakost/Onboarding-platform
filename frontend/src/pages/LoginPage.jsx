import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{
        height: '100vh',           
        display: 'flex',           
        alignItems: 'center',      
        justifyContent: 'center',  
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%',
          borderRadius: 2 
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Вхід в систему
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email адреса"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Увійти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;