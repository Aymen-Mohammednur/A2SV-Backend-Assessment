const Project = require("../models/project-model");
const User = require("../models/user-model");
// const { projectValidation } = require("../middlewares/validation");

const createProject = async (req, res) => {
    const { error } = projectValidation(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const newProject = new Project({
        ...req.body,
        owner: req.user._id
    })

    try {
        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const getUserProjects = async (req, res) => {
    try {
        const id = req.user._id;
        const projects = await Project.find({ owner: id }).sort({ created_at: -1 });
        res.status(200).json(projects)
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

const getSingleProject = async (req, res) => {
    try {
        const id = req.user._id;
        const projects = await Project.find({ owner: id, _id: req.params.id }).sort({ created_at: -1 });
        res.status(200).json(projects)
        return;
    } catch (error) {
        res.json({ message: error });
    }
};


const editProject = async (req, res) => {
    try {
        const { error } = projectValidation(req.body);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const project = await Project.findById(req.params.id);
        if (project.owner.toString() != req.user._id.toString()) {
            return res.status(401).send({ message: "You are not allowed to edit this project" });
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // Check if project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user ID matches the project's user ID
        if (project._doc.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this project' });
        }

        // Remove the project
        const removedProject = await Project.deleteOne({ _id: req.params.id });
        res.status(204).json(removedProject);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the project' + error });
    }
};

const assignTaskToProject = async (req, res) => {
    try {
        const project = await Project.findById(req.body.project_id);

        // Check if project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user ID matches the project's user ID
        if (project._doc.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized: You are not allowed to assign tasks to this project' });
        }

        project.tasks.push(req.body.task_id)
        await project.save()
        res.status(200).json(project)

    } catch (error) {
        res.status(400).json({ message: 'An error occurred while assigning the task to the project' + error });
    }
};

const collaborate = async (req, res) => {
    try {
        const project = await Project.findById(req.body.project_id);

        // Check if project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user ID matches the project's user ID
        if (project._doc.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized: You are not allowed to assign collaborators to this project' });
        }

        project.members.push(req.body.user_id)
        await project.save()
        res.status(200).json(project)

    } catch (error) {
        res.status(400).json({ message: 'An error occurred while assigning the task to the project' + error });
    }
};

module.exports = {
    createProject,
    editProject,
    deleteProject,
    getUserProjects,
    getSingleProject,
    assignTaskToProject,
    collaborate
};