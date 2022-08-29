import Task from '../models/Task'
import {getPagination} from '../libs/getPagination'

export const findAllTasks = async (req, res) => {

    const {size,page,title} = req.query;
    const condition = title ? {
        title:{$regex: new RegExp(title) , $options : "i"}
    } :{};
    const {limit,offset} = getPagination(page, size);
    const data = await Task.paginate(condition,{offset,limit});
    res.json({
        totalItems: data.totalDocs,
        tasks: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1
    })
}

export const createTask = async (req, res) => {

    if (!req.body.title) {
        return res.status(400).send({ message: 'Contet annot be empty' })
    }

    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            done: req.body.done ? req.body.done : false
        });
        const taskSaved = await newTask.save();
        res.json(taskSaved);
    } catch (err) {
        res.status(500).json({
            message: err.message || "Something goes wrong retrieving the tasks"
        });
    }
}

export const findAllDoneTasks = async (req, res) => {
    const tasks = await Task.find({ done: true });
    res.json(tasks)
}

export const findOneTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: `Task with id ${id} does not exist` });
        res.json(task);
    }catch(err) {
        res.status(500).json({ message: err.message || "Something goes wrong retrieving the tasks"})
    }
}

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Task deleted successfully'
    });
}

export const updateTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Task updated successfully' });
}