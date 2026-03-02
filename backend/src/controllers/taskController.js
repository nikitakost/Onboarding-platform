const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo: assignedTo || req.user.userId, 
      dueDate
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при створенні задачі', error: error.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'HR') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user.userId })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні задач', error: error.message });
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    const task = await Task.findOneAndUpdate(
      { _id: id, assignedTo: req.user.userId }, 
      { status },
      { new: true } 
    );

    if (!task) {
      return res.status(404).json({ message: 'Задачу не знайдено або у вас немає доступу' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні статусу', error: error.message });
  }
};