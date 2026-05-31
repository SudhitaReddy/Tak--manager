const express = require("express");

const {
  createTask,
  getTasks,
  getDeletedTasks,
  updateTask,
  deleteTask,
  restoreTask,
  permanentDeleteTask,
} = require("../controllers/taskController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get active tasks & create task
router
  .route("/")
  .get(protect, getTasks)
  .post(protect, createTask);

// Get trash tasks
router.get(
  "/trash",
  protect,
  getDeletedTasks
);

// Restore task
router.put(
  "/restore/:id",
  protect,
  restoreTask
);

// Permanently delete task
router.delete(
  "/permanent/:id",
  protect,
  permanentDeleteTask
);

// Update task & move to trash
router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;