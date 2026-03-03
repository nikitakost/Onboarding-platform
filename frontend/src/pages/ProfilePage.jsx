import { useState } from 'react';
import { 
  Typography, Box, Card, CardContent, Avatar, Grid, Divider, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    position: user?.position || '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.patch('/auth/profile', formData);
      
      user.name = data.name;
      user.position = data.position;
      
      toast.success('Профіль успішно оновлено!');
      setOpen(false);
    } catch {
      toast.error('Не вдалося оновити профіль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ height: 120, bgcolor: 'primary.main' }} />
        
        <CardContent sx={{ position: 'relative', pt: 0, px: 4, pb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt="-50px" mb={3}>
            <Avatar 
              sx={{ width: 100, height: 100, fontSize: '3rem', bgcolor: 'secondary.main', border: '4px solid white', boxShadow: 2 }}
            >
              {getInitial(user?.name)}
            </Avatar>
            
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />} 
              onClick={() => setOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Редагувати
            </Button>
          </Box>

          {/* Основна інформація */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {user?.name}
          </Typography>
          
          <Box display="flex" gap={1} mb={4}>
            <Chip 
              label={user?.role === 'HR' ? 'HR Менеджер' : 'Співробітник'} 
              color={user?.role === 'HR' ? 'secondary' : 'primary'} 
              size="small" 
            />
            {user?.vibeResult && (
              <Chip 
                icon={<PsychologyIcon />} 
                label="Вайб-тест пройдено" 
                color="success" 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Деталі профілю */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Email адреса</Typography>
                  <Typography variant="body1" fontWeight="500">{user?.email}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <WorkIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Посада</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {user?.position || <span style={{ fontStyle: 'italic', color: 'gray' }}>Не вказано</span>}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          {user?.vibeResult && (
            <Box mt={4} p={2} bgcolor="success.50" borderRadius={2} border="1px solid" borderColor="success.100">
              <Typography variant="subtitle2" color="success.dark" fontWeight="bold" mb={1}>
                Результат Вайб-тесту:
              </Typography>
              <Typography variant="body2" color="success.900">
                {user.vibeResult}
              </Typography>
            </Box>
          )}

        </CardContent>
      </Card>

      {/* Модальне вікно редагування */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Редагувати профіль</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Ваше ім'я" fullWidth variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense" label="Посада (наприклад, Frontend Розробник)" fullWidth variant="outlined"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Скасувати</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={isSubmitting || !formData.name}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;