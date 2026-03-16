const Setting = require('../models/Setting');

// Отримання привітального листа (для всіх)
exports.getWelcomeLetter = async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'welcome_letter' });

    if (!setting) {
      setting = new Setting({ 
        key: 'welcome_letter', 
        content: 'Ласкаво просимо до нашої команди! Ми дуже раді бачити вас тут. Цей текст може бути змінений HR-менеджером.',
        videoUrl: ''
      });
      await setting.save();
    }
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні листа' });
  }
};

// Оновлення листа (ТІЛЬКИ ДЛЯ HR)
exports.updateWelcomeLetter = async (req, res) => {
  try {
    if (req.user.role !== 'HR') {
      return res.status(403).json({ message: 'Доступ заборонено. Тільки HR може редагувати цей текст.' });
    }

    const { content, videoUrl } = req.body;
    
    const setting = await Setting.findOneAndUpdate(
      { key: 'welcome_letter' },
      { content, videoUrl },
      { new: true, upsert: true } 
    );

    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при збереженні листа' });
  }
};