import { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Button, CircularProgress, TextField, Divider 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import YouTubeIcon from '@mui/icons-material/YouTube'; 
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const WelcomeLetterPage = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLetter();
  }, []);

  const fetchLetter = async () => {
    try {
      const { data } = await api.get('/settings/welcome');
      setContent(data.content || '');
      setVideoUrl(data.videoUrl || '');
      setEditValue(data.content || '');
      setEditVideoUrl(data.videoUrl || '');
    } catch {
      toast.error('Не вдалося завантажити лист');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.patch('/settings/welcome', { 
        content: editValue, 
        videoUrl: editVideoUrl 
      });
      setContent(data.content);
      setVideoUrl(data.videoUrl);
      setIsEditing(false);
      toast.success('Привітальний лист успішно оновлено!');
    } catch{
      toast.error('Помилка при збереженні');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <Box maxWidth="md" mx="auto" mt={2} pb={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Welcome Letter
        </Typography>

        {user?.role === 'HR' && !isEditing && (
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={() => setIsEditing(true)}
          >
            Редагувати
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, minHeight: '300px', bgcolor: 'background.paper' }}>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Текст привітання"
              variant="outlined"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Посилання на YouTube відео (необов'язково)"
              variant="outlined"
              placeholder="Наприклад: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={editVideoUrl}
              onChange={(e) => setEditVideoUrl(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: <YouTubeIcon color="error" sx={{ mr: 1 }} />
              }}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button onClick={() => setIsEditing(false)} color="inherit" disabled={isSaving}>
                Скасувати
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />} 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Збереження...' : 'Зберегти зміни'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography 
              variant="body1" 
              sx={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.6, mb: embedUrl ? 4 : 0 }}
            >
              {content}
            </Typography>

            {embedUrl && (
              <>
                <Divider sx={{ mb: 4 }} />
                <Typography variant="h6" fontWeight="bold" mb={2} color="text.secondary">
                  Відео-звернення:
                </Typography>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={embedUrl}
                    title="Welcome Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WelcomeLetterPage;