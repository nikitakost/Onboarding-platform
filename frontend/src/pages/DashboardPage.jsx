import { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Card, CardContent, CircularProgress, LinearProgress, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar 
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
  const [employees, setEmployees] = useState([]); 
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
          setEmployees(onlyEmployees);
        }
      } catch (error) {
        console.error('Помилка завантаження даних', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  // Загальна статистика
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = totalTasks - doneTasks;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  const employeeStats = employees.map(emp => {
    const empTasks = tasks.filter(t => t.assignedTo && t.assignedTo._id === emp._id);
    const total = empTasks.length;
    const done = empTasks.filter(t => t.status === 'Done').length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    
    return { ...emp, totalTasks: total, doneTasks: done, progress };
  });

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
    <Box maxWidth="lg" mx="auto" pb={6}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Огляд {user?.role === 'HR' ? 'компанії' : 'онбордингу'}
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={user?.role === 'HR' ? "Загалом задач" : "Мої задачі"} 
            value={totalTasks} 
            icon={<AssignmentIcon fontSize="large" />} color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Виконано" value={doneTasks} icon={<CheckCircleIcon fontSize="large" />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="В черзі" value={pendingTasks} icon={<PendingActionsIcon fontSize="large" />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {user?.role === 'HR' ? (
            <StatCard title="Співробітників" value={employees.length} icon={<PeopleIcon fontSize="large" />} color="info" />
          ) : (
            <StatCard title="Мій прогрес" value={`${progressPercentage}%`} icon={<CheckCircleIcon fontSize="large" />} color="info" />
          )}
        </Grid>
      </Grid>

      {/* Головний прогрес-бар */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
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
            <Typography variant="body1" color="text.secondary" fontWeight="bold">{progressPercentage}%</Typography>
          </Box>
        </Box>
      </Paper>
      {user?.role === 'HR' && (
        <Box mt={2}>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Прогрес співробітників
          </Typography>
          
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Співробітник</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Задачі (Виконано / Всього)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Прогрес</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      Немає співробітників для відображення
                    </TableCell>
                  </TableRow>
                ) : (
                  employeeStats.map(emp => (
                    <TableRow key={emp._id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {emp.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{emp.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="500">
                          {emp.doneTasks} / {emp.totalTasks}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box width="100%">
                            <LinearProgress
                              variant="determinate"
                              value={emp.progress}
                              color={emp.progress === 100 ? "success" : "primary"}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold" minWidth={40} textAlign="right">
                            {emp.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

    </Box>
  );
};

export default DashboardPage;