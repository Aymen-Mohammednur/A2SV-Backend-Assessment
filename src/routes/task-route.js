const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task-controller");
const verifyToken = require("../middlewares/verify-token");

router.post("/", verifyToken, taskController.createTask);

router.put("/assign-user", verifyToken, taskController.assignTaskToUser);

router.get("/", verifyToken, taskController.getUserTasks);

router.put("/:id", verifyToken, taskController.editTask);

router.delete("/:id", verifyToken, taskController.deleteTask);

module.exports = router;
