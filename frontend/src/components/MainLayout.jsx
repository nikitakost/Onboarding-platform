import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Button 
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WavingHandIcon from '@mui/icons-material/WavingHand';

const drawerWidth = 240;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 


  const menuItems = [
    { text: 'Дашборд', icon: <DashboardIcon />, path: '/' },
    { text: 'Welcome Letter', icon: <WavingHandIcon />, path: '/welcome' },
    { text: 'Мої задачі', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Вайбтест', icon: <PsychologyIcon />, path: '/vibe-test' },
    { text: 'Профіль', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HR Onboarding Platform
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Привіт, {user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Вийти
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {user?.role === 'HR' ? 'HR Portal' : 'My Onboarding'}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path} 
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Maine Zone */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar /> 
        <Outlet />  
      </Box>
    </Box>
  );
};

export default MainLayout;