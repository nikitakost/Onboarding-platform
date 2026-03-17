import { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, Button, Grid, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/authContext';

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch {
      toast.error('Не вдалося завантажити документи');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Будь ласка, оберіть файл');
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', docName || file.name);

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Документ успішно завантажено!');
      setOpen(false);
      setFile(null);
      setDocName('');
      fetchDocuments();
    } catch {
      toast.error('Помилка завантаження файлу');
    } finally {
      setIsUploading(false);
    }
  };

  const uniqueUsers = [];
  const userIds = new Set();
  documents.forEach(doc => {
    if (doc.user && !userIds.has(doc.user._id)) {
      userIds.add(doc.user._id);
      uniqueUsers.push(doc.user);
    }
  });

  const filteredDocuments = documents.filter(doc => {
    if (selectedUserFilter === 'All') return true;
    return doc.user?._id === selectedUserFilter;
  });

  const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  return (
    <Box maxWidth="lg" mx="auto" pb={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          {user?.role === 'HR' ? 'Документи співробітників' : 'Мої документи'}
        </Typography>

        {user?.role !== 'HR' && (
          <Button 
            variant="contained" 
            startIcon={<FileUploadIcon />} 
            onClick={() => setOpen(true)}
          >
            Завантажити файл
          </Button>
        )}
      </Box>

      {user?.role === 'HR' && documents.length > 0 && (
        <Box mb={4} maxWidth={300}>
          <FormControl fullWidth size="small">
            <InputLabel>Відфільтрувати за співробітником</InputLabel>
            <Select
              value={selectedUserFilter}
              label="Відфільтрувати за співробітником"
              onChange={(e) => setSelectedUserFilter(e.target.value)}
            >
              <MenuItem value="All">Всі співробітники</MenuItem>
              {uniqueUsers.map(u => (
                <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {filteredDocuments.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="body1" color="text.secondary">
            Документів ще немає.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDocuments.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc._id}>
              <Card elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Box sx={{ bgcolor: 'primary.light', color: 'primary.dark', p: 1.5, borderRadius: 2, mr: 2 }}>
                  <InsertDriveFileIcon />
                </Box>
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {doc.name}
                  </Typography>
                  {user?.role === 'HR' && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      👤 Від: {doc.user?.name}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(doc.createdAt).toLocaleDateString('uk-UA')}
                  </Typography>
                </Box>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href={`${baseURL}${doc.fileUrl}`} 
                  target="_blank" 
                  download
                  title="Завантажити / Відкрити"
                >
                  <DownloadIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Завантажити документ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Назва документа (необов'язково)"
            value={docName} onChange={(e) => setDocName(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />
          
          <Button variant="outlined" component="label" fullWidth sx={{ py: 4, borderStyle: 'dashed' }}>
            {file ? `Обрано: ${file.name}` : 'Натисніть, щоб обрати файл (PDF, JPG, PNG)'}
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Скасувати</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!file || isUploading}>
            {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Завантажити'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;