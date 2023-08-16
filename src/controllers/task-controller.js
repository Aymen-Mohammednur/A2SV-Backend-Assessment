const Task = require("../models/task-model");
const User = require("../models/user-model");
const { taskValidation } = require("../middlewares/validation");

const createTask = async (req, res) => {
    const { error } = taskValidation(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const newTask = new Task({
        ...req.body,
        creator_id: req.user._id
    })

    try {
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const getUserTasks = async (req, res) => {
    try {
        const id = req.user._id;
        const tasks = await Task.find({ creator_id: id }).sort({ created_at: -1 });
        res.status(200).json(tasks)
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// const getSingleUsertask = async (req, res) => {
//     try {
//         const id = req.user._id;
//         const tasks = await task.find({ userId: id, _id: req.params.id }).sort({ created_at: -1 });
//         res.status(200).json(tasks)
//         return;
//     } catch (error) {
//         res.json({ message: error });
//     }
// };


const editTask = async (req, res) => {
    try {
        const { error } = taskValidation(req.body);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const task = await Task.findById(req.params.id);
        if ((task._doc.creator_id.toString() !== req.user._id) || (!task._doc.assigned_to.includes(req.user._id))) {
            return res.status(401).send({ message: "You are not allowed to edit this task" });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the user is allowed to delete the task
        if ((task._doc.creator_id.toString() !== req.user._id) || (!task._doc.assigned_to.includes(req.user._id))) {
            return res.status(403).json({ message: 'Unauthorized: You are not allowed to delete this task' });
        }

        // Remove the task
        const removedtask = await task.deleteOne({ _id: req.params.id });
        res.status(204).json(removedtask);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the task' + error });
    }
};

const assignTaskToUser = async (req, res) => {
    try {
        const task = await Task.findById(req.body.task_id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the user ID matches the task's user ID
        if (task._doc.creator_id.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized: You are not allowed to assign users to this task' });
        }

        task.assigned_to.push(req.body.user_id)
        await task.save()
        res.status(200).json(task)

    } catch (error) {
        res.status(400).json({ message: 'An error occurred while assigning the user to the task' + error });
    }
};

module.exports = {
    createTask,
    editTask,
    deleteTask,
    getUserTasks,
    assignTaskToUser
    // getSingleUsertask
};