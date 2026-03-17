import { useState, useEffect } from 'react';
import { 
  Typography, Box, Card, CardContent, Button, Radio, RadioGroup, 
  FormControlLabel, FormControl, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const questions = [
  { id: 1, text: 'Як ви зазвичай починаєте свій робочий день?', options: { A: 'Складаю чіткий план і дотримуюсь його.', B: 'Перевіряю пошту/чати та реагую на найтерміновіші запити.', V: 'Мені потрібен час на «розкачку» та спілкування з колегами.' } },
  { id: 2, text: 'Який спосіб отримання фідбеку для вас найкомфортніший?', options: { A: 'Прямий і чесний, навіть якщо він критичний.', B: 'М\'який, з акцентом на мої сильні сторони.', V: 'Регулярні короткі зустрічі тет-а-тет.' } },
  { id: 3, text: 'У командній роботі ви частіше за все...', options: { A: 'Берете на себе роль лідера або координатора.', B: 'Старанно виконуєте свою частину роботи як експерт.', V: 'Виступаєте «клеєм» команди, підтримуючи позитивну атмосферу.' } },
  { id: 4, text: 'Що вас мотивує найбільше?', options: { A: 'Професійний розвиток та складні виклики.', B: 'Стабільність, комфортні умови та гідна оплата.', V: 'Визнання моїх заслуг та відчуття користі для компанії.' } },
  { id: 5, text: 'Як ви реагуєте на різку зміну планів або пріоритетів?', options: { A: 'Швидко адаптуюсь і переключаюсь на нові задачі.', B: 'Мені потрібен час, щоб зрозуміти причини змін і звикнути.', V: 'Це викликає у мене стрес, я віддаю перевагу стабільності.' } },
  { id: 6, text: 'Якому формату комунікації ви віддаєте перевагу?', options: { A: 'Письмові повідомлення (Slack, пошта) — щоб залишився слід.', B: 'Короткі відеодзвінки — так швидше все вирішити.', V: 'Особисті зустрічі — мені важливо бачити емоції співрозмовника.' } },
  { id: 7, text: 'Виберіть твердження, яке вам найближче:', options: { A: '«Краще зробити ідеально, навіть якщо це займе більше часу».', B: '«Краще зробити вчасно і просто добре, ніж ідеально, але пізно».', V: '«Результат важливий, але атмосфера в процесі — не менш важлива».' } },
  { id: 8, text: 'Як ви поводитеся в конфліктних ситуаціях?', options: { A: 'Намагаюся аргументовано довести свою правоту.', B: 'Шукаю компроміс, який задовольнить обидві сторони.', V: 'Намагаюся уникати гострих кутів та згладжувати конфлікт.' } },
  { id: 9, text: 'Скільки соціальної взаємодії вам потрібно впродовж дня?', options: { A: 'Мінімально, я краще працюю наодинці з фокусом на результат.', B: 'Помірно, мені важливо періодично обговорювати ідеї з колегами.', V: 'Багато, я заряджаюся енергією від спілкування з людьми.' } },
  { id: 10, text: 'Як ви ставитесь до мікроменеджменту (контролю кожного кроку)?', options: { A: 'Категорично негативно, мені потрібна повна автономія.', B: 'Спокійно, якщо це допомагає уникнути помилок на початку.', V: 'Мені подобається мати чіткі інструкції та регулярне підтвердження, що я все роблю правильно.' } },
  { id: 11, text: 'Коли ви стикаєтесь з невідомою проблемою, ви...', options: { A: 'Самостійно шукаєте рішення в інтернеті чи документації.', B: 'Одразу звертаєтесь до колег за порадою чи допомогою.', V: 'Просите керівника дати чіткий алгоритм дій.' } },
  { id: 12, text: 'Яка атмосфера в офісі (або віртуальному просторі) для вас ідеальна?', options: { A: 'Тиха, спокійна, де кожен зайнятий своєю справою.', B: 'Динамічна, де постійно щось відбувається та обговорюється.', V: 'Дружня та неформальна, де колеги — це майже друзі.' } },
];

const resultDescriptions = {
  A: 'Більшість «А»: Проактивний, автономний співробітник, орієнтований на результат. Потребує свободи та чітких цілей.',
  B: 'Більшість «Б»: Надійний командний гравець, адаптивний та раціональний. Цінує структуру та зрозумілі процеси.',
  V: 'Більшість «В»: Емпатичний співробітник, для якого важлива корпоративна культура та стосунки. Найкраще працює в підтримуючому середовищі.'
};

const VibeTestPage = () => {
  const { user } = useAuth();
  
  const [answers, setAnswers] = useState({});
  const [savedResult, setSavedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (user?.role === 'HR') {
      fetchEmployees();
    } else if (user?.vibeResult) {
      setSavedResult(user.vibeResult);
    }
  }, [user]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const { data } = await api.get('/auth/users');
      const onlyEmployees = data.filter(u => u.role === 'Employee');
      setEmployees(onlyEmployees);
    } catch {
      toast.error('Не вдалося завантажити список співробітників');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const counts = { A: 0, B: 0, V: 0 };
    Object.values(answers).forEach(val => { counts[val]++; });
    const maxOption = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const finalResult = resultDescriptions[maxOption];

    try {
      await api.patch('/auth/vibe', { result: finalResult });
      setSavedResult(finalResult);
      toast.success('Тест успішно завершено!');
      user.vibeResult = finalResult; 
    } catch {
      toast.error('Помилка при збереженні результату');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  // For HR (table)
  if (user?.role === 'HR') {
    return (
      <Box maxWidth="lg" mx="auto" mt={2} pb={6}>
        <Typography variant="h4" mb={4} fontWeight="bold">Вайб-профілі команди</Typography>
        
        {loadingEmployees ? (
          <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Співробітник</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Результат Вайб-тесту</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Співробітників ще немає</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp._id} hover>
                      <TableCell sx={{ fontWeight: '500' }}>{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>
                        {emp.vibeResult ? (
                          <Alert severity="info" sx={{ py: 0, '& .MuiAlert-message': { py: 1 } }}>
                            {emp.vibeResult}
                          </Alert>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Ще не проходив(ла) тест
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  
  // For EMPLOYEE 
  if (savedResult) {
    return (
      <Box maxWidth="md" mx="auto" mt={4}>
        <Typography variant="h4" mb={3} fontWeight="bold">Ваш Вайб-профіль</Typography>
        <Alert severity="success" sx={{ fontSize: '1.1rem', p: 3 }}>
          {savedResult}
        </Alert>
      </Box>
    );
  }

  const isTestComplete = Object.keys(answers).length === questions.length;

  return (
    <Box maxWidth="md" mx="auto" pb={6}>
      <Typography variant="h4" mb={2} fontWeight="bold">Вайб-чек</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Дайте відповідь на 12 питань, щоб ми могли краще зрозуміти ваш стиль роботи та підібрати ідеальний формат взаємодії.
      </Typography>

      {questions.map((q, index) => (
        <Card key={q.id} sx={{ mb: 3, p: 2 }} elevation={2}>
          <CardContent>
            <Typography variant="h6" mb={2}>{index + 1}. {q.text}</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[q.id] || ''}
                onChange={(e) => handleOptionChange(q.id, e.target.value)}
              >
                <FormControlLabel value="A" control={<Radio />} label={`А) ${q.options.A}`} />
                <FormControlLabel value="B" control={<Radio />} label={`Б) ${q.options.B}`} />
                <FormControlLabel value="V" control={<Radio />} label={`В) ${q.options.V}`} />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button 
          variant="contained" 
          size="large" 
          disabled={!isTestComplete || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Дізнатись результат'}
        </Button>
      </Box>
    </Box>
  );
};

export default VibeTestPage;