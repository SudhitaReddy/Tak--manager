const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      stage: req.body.stage || "Todo",
      priority: req.body.priority || "Medium",
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Active Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      isDeleted: false,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Deleted Tasks
const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      isDeleted: true,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    task.title = req.body.title || task.title;

    task.description =
      req.body.description || task.description;

    task.stage =
      req.body.stage || task.stage;

    task.priority =
      req.body.priority || task.priority;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Move Task To Trash
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    task.isDeleted = true;

    await task.save();

    res.json({
      message: "Task moved to trash",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Restore Task
const restoreTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    task.isDeleted = false;

    await task.save();

    res.json({
      message: "Task restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Permanent Delete
const permanentDeleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getDeletedTasks,
  updateTask,
  deleteTask,
  restoreTask,
  permanentDeleteTask,
};