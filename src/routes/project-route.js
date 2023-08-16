const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project-controller");
const verifyToken = require("../middlewares/verify-token");

router.post("/", verifyToken, projectController.createProject);

router.get("/:id", verifyToken, projectController.getSingleProject);

router.get("/", verifyToken, projectController.getUserProjects);

router.put("/:id", verifyToken, projectController.editProject);

router.put("/assign-task", verifyToken, projectController.assignTaskToProject);

router.put("/collaborate", verifyToken, projectController.collaborate);

router.delete("/:id", verifyToken, projectController.deleteProject);

module.exports = router;
