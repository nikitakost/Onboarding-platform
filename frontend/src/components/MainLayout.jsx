import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, 
  Button, Switch, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Avatar, ListItemAvatar 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; 
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';

import api from '../services/api';
import { toast } from 'react-hot-toast';

import { useAuth } from '../context/authContext';
import { useThemeContext } from '../context/ThemeContext'; 

const drawerWidth = 240;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeContext(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false); 
  const [passOpen, setPassOpen] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordChange = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error('Нові паролі не співпадають!');
    }
    if (passData.newPassword.length < 6) {
      return toast.error('Пароль має містити мінімум 6 символів');
    }

    setIsChangingPass(true);
    try {
      await api.patch('/auth/password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      toast.success('Пароль успішно змінено!');
      setPassOpen(false); 
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Помилка при зміні пароля');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Дашборд', icon: <DashboardIcon />, path: '/' },
    { text: 'Welcome Letter', icon: <WavingHandIcon />, path: '/welcome' },
    { text: 'Мої задачі', icon: <AssignmentIcon />, path: '/tasks' },
    { text: 'Вайбтест', icon: <PsychologyIcon />, path: '/vibe-test' },
    { text: 'Профіль', icon: <PersonIcon />, path: '/profile' },
    { text: 'Документи', icon: <FolderIcon />, path: '/documents' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* ВЕРХНЯ ШАПКА */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* 👈 ЛІВА ЧАСТИНА (Логотип) */}
          <Typography 
            variant="h6" 
            sx={{ fontWeight: '900', letterSpacing: 1, userSelect: 'none' }}
          >
            Onboarding<Box component="span" sx={{ color: 'warning.main' }}>+</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
              Привіт, {user?.name}
            </Typography>
            
            <IconButton color="inherit" onClick={() => setContactsOpen(true)} title="Допомога та Контакти">
              <HelpOutlineIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => setSettingsOpen(true)} title="Налаштування">
              <SettingsIcon />
            </IconButton>

            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ ml: 1 }}>
              Вийти
            </Button>
          </Box>
          
        </Toolbar>
      </AppBar>

      {/* БІЧНЕ МЕНЮ (НАВІГАЦІЯ) */}
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            HR Platform
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    borderRight: isActive ? '4px solid' : '4px solid transparent',
                    borderColor: 'primary.main',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.main' : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ '& .MuiTypography-root': {
                      color: isActive ? 'primary.main' : 'inherit',
                      fontWeight: isActive ? 'bold' : 'normal'
                    }}}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ mt: 'auto', p: 2, pb: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
            © 2026 HR Platform v1.0 <br /> by Nikita Kostenko
          </Typography>
        </Box>

      </Drawer>

      {/* ПРАВА ПАНЕЛЬ КОНТАКТІВ */}
      <Drawer anchor="right" open={contactsOpen} onClose={() => setContactsOpen(false)}>
        <Box sx={{ width: 340, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Потрібна допомога?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Звертайтеся до наших спеціалістів, якщо у вас виникли питання.
          </Typography>

          <List sx={{ bgcolor: 'background.default', borderRadius: 2, p: 1 }}>
            <ListItem alignItems="flex-start" sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>HR</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight="bold">Відділ кадрів (HR)</Typography>}
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1} mb={0.5}>
                      <EmailIcon fontSize="small" color="action" /> hr@company.com
                    </Typography>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                      <TelegramIcon fontSize="small" color="action" /> @hr_support
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>IT</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight="bold">IT Підтримка</Typography>}
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1} mb={0.5}>
                      <EmailIcon fontSize="small" color="action" /> it@company.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (Налаштування, техніка, баги)
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start" sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'success.main' }}>$</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight="bold">Бухгалтерія</Typography>}
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" color="action" /> finance@company.com
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </List>
          
          <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => setContactsOpen(false)}>
            Закрити
          </Button>
        </Box>
      </Drawer>

      {/* ПРАВА ПАНЕЛЬ НАЛАШТУВАНЬ */}
      <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Налаштування
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <DarkModeIcon color="action" />
              <Typography>Темна тема</Typography>
            </Box>
            <Switch checked={mode === 'dark'} onChange={toggleColorMode} color="primary" />
          </Box>
          
          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" color="text.secondary" mb={2} sx={{ textTransform: 'uppercase' }}>
            Система
          </Typography>
          <Box display="flex" alignItems="center" gap={1.5} mb={3} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
            <LanguageIcon color="action" />
            <Typography variant="body2">Мова інтерфейсу: <b>Українська</b></Typography>
          </Box>
          
          <Button variant="outlined" color="error" fullWidth size="small" onClick={() => setPassOpen(true)}>
            Змінити пароль
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
      <Dialog open={passOpen} onClose={() => setPassOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Зміна пароля</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="Поточний пароль" type="password" fullWidth variant="outlined"
            value={passData.currentPassword}
            onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense" label="Новий пароль" type="password" fullWidth variant="outlined"
            value={passData.newPassword}
            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense" label="Підтвердіть новий пароль" type="password" fullWidth variant="outlined"
            value={passData.confirmPassword}
            onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPassOpen(false)} color="inherit">Скасувати</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained" 
            color="primary"
            disabled={isChangingPass || !passData.currentPassword || !passData.newPassword || !passData.confirmPassword}
          >
            {isChangingPass ? <CircularProgress size={24} color="inherit" /> : 'Зберегти'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;