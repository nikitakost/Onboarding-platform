import { Typography } from '@mui/material';
import { useAuth } from '../context/authContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>Мій профіль</Typography>
      <Typography variant="body1">Ім'я: {user?.name}</Typography>
      <Typography variant="body1">Посада: {user?.position}</Typography>
      <Typography variant="body1">Роль: {user?.role}</Typography>
    </div>
  );
};

export default ProfilePage;