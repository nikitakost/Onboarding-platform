import { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, CardContent, Grid, Chip, CircularProgress, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do': return 'default';
    case 'In Progress': return 'primary';
    case 'Done': return 'success';
    default: return 'default';
  }
};

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'HR') {
      fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch{
      toast.error('Не вдалося завантажити задачі');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Помилка завантаження користувачів:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const { data } = await api.post('/tasks', newTask);
      setTasks([data, ...tasks]);
      setOpen(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
      toast.success('Задачу успішно створено!');
    } catch  {
      toast.error('Помилка при створенні задачі');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? data : task));
      toast.success('Статус успішно оновлено!');
    } catch {
      toast.error('Не вдалося оновити статус');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {user?.role === 'HR' ? 'Управління задачами' : 'Мій план онбординга'}
        </Typography>

        {user?.role === 'HR' && (
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Створити задачу
          </Button>
        )}
      </Box>

      {tasks.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          У вас поки немає задач.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
                    <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{task.description}</Typography>
                  {user?.role === 'HR' && task.assignedTo && (
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      👤 Виконавець: {task.assignedTo.name}
                    </Typography>
                  )}

                  {task.dueDate && (
                    <Typography variant="caption" color="error" sx={{ fontWeight: 'bold', display: 'block' }}>
                      Дедлайн: {new Date(task.dueDate).toLocaleDateString('uk-UA')}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  {task.status !== 'Done' && user?.role !== 'HR' && (
                    <Button 
                      variant="outlined" 
                      color="success" 
                      size="small" 
                      fullWidth
                      onClick={() => handleStatusChange(task._id, 'Done')}
                    >
                      Відмітити як виконане
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Модальное окно */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Призначити нову задачу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Назва задачі" fullWidth
            value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense" label="Опис" fullWidth multiline rows={3}
            value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            margin="dense" label="Дедлайн" type="date" fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            sx={{ mb: 2 }} 
          />
         
          <FormControl fullWidth margin="dense">
            <InputLabel id="assign-user-label">Кому призначити</InputLabel>
            <Select
              labelId="assign-user-label"
              value={newTask.assignedTo}
              label="Кому назначить"
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name} ({u.role}) - {u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Відмінити</Button>
          <Button onClick={handleCreateTask} variant="contained" disabled={!newTask.title || !newTask.assignedTo}>
            Створити задачу
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksPage;