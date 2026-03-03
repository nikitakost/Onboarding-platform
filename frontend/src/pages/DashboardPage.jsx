import { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Card, CardContent, CircularProgress, LinearProgress, Paper 
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/authContext';

import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: tasksData } = await api.get('/tasks');
        setTasks(tasksData);
        if (user?.role === 'HR') {
          const { data: usersData } = await api.get('/auth/users');
          const onlyEmployees = usersData.filter(u => u.role === 'Employee');
          setEmployeesCount(onlyEmployees.length);
        }
      } catch (error) {
        console.error('Помилка завантаження даних для дашборду', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  // Stats calculations
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = totalTasks - doneTasks;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, p: 2, borderRadius: 2, display: 'flex', mr: 2 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Card>
  );

  return (
    <Box maxWidth="lg" mx="auto">
      <Typography variant="h4" mb={4} fontWeight="bold">
        Огляд {user?.role === 'HR' ? 'компанії' : 'онбордингу'}
      </Typography>

      <Grid container spacing={3} mb={4}>
        {/* Картка 1: Усі задачі */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={user?.role === 'HR' ? "Загалом задач" : "Мої задачі"} 
            value={totalTasks} 
            icon={<AssignmentIcon fontSize="large" />} 
            color="primary" 
          />
        </Grid>
        
        {/* Картка 2: Виконані задачі */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Виконано" 
            value={doneTasks} 
            icon={<CheckCircleIcon fontSize="large" />} 
            color="success" 
          />
        </Grid>

        {/* Картка 3: В процесі / Очікують */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="В черзі" 
            value={pendingTasks} 
            icon={<PendingActionsIcon fontSize="large" />} 
            color="warning" 
          />
        </Grid>

        {/* Картка 4: Унікальна для ролі */}
        <Grid item xs={12} sm={6} md={3}>
          {user?.role === 'HR' ? (
            <StatCard 
              title="Співробітників" 
              value={employeesCount} 
              icon={<PeopleIcon fontSize="large" />} 
              color="info" 
            />
          ) : (
            <StatCard 
              title="Мій прогрес" 
              value={`${progressPercentage}%`} 
              icon={<CheckCircleIcon fontSize="large" />} 
              color="info" 
            />
          )}
        </Grid>
      </Grid>

   
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          {user?.role === 'HR' ? 'Загальний рівень адаптації по компанії' : 'Ваш прогрес виконання плану'}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={2}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ height: 12, borderRadius: 5 }} 
              color={progressPercentage === 100 ? "success" : "primary"}
            />
          </Box>
          <Box minWidth={45}>
            <Typography variant="body1" color="text.secondary" fontWeight="bold">
              {progressPercentage}%
            </Typography>
          </Box>
        </Box>
        {progressPercentage === 100 && totalTasks > 0 && (
          <Typography variant="body2" color="success.main" mt={2} fontWeight="bold">
            Вітаємо! Всі завдання виконано 🎉
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;