import Task from '../models/Task';

// Read tasks
export async function readTasks(req, res) {
	try {
		const tasks = await Task.findAll({
			order: [['id', 'ASC']],
		});

		res.json({ data: tasks });
	} catch (error) {
		return res.status(400).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}

// Read one task
export async function getOneTask(req, res) {
	const { id } = req.params;

	try {
		const task = await Task.findOne({
			where: { id },
		});

		res.json({ data: task });
	} catch (error) {
		return res.status(400).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}

// Read all tasks of one project
export async function getTasksOfProject(req, res) {
	const { projectId } = req.params;

	try {
		const tasks = await Task.findAll({
			where: { projectId },
			order: [['id', 'ASC']],
		});

		res.json({ data: tasks });
	} catch (error) {
		return res.status(400).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}

// Create new task
export async function createTask(req, res) {
	const { name, status, projectId } = req.body;

	try {
		let newTask = await Task.create(
			{
				name,
				status,
				projectId,
			},
			{ name, status, projectId },
		);

		if (newTask) {
			return res.json({
				message: 'Task created succesfully.',
				data: newTask,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}

// Update task
export async function updateTask(req, res) {
	const { id } = req.params;
	const { name, status, projectId } = req.body;

	try {
		const tasks = await Task.findAll({
			attributes: ['name', 'status', 'projectId'],
			where: { id },
		});

		if (tasks) {
			tasks.forEach(async (task) => {
				await task.update({
					id,
					name,
					status,
					projectId,
				});
			});
		}

		res.json({
			message: 'Task(s) update succefully.',
			data: tasks,
		});
	} catch (error) {
		return res.status(400).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}

// Delete task
export async function deleteTask(req, res) {
	const { id } = req.params;

	try {
		const deleteRowCount = await Task.destroy({
			where: { id },
		});

		res.json({
			message: 'Task(s) delete succefully.',
			data: deleteRowCount,
		});
	} catch (error) {
		return res.status(400).json({
			message: 'Something goes wrong.',
			data: error,
		});
	}
}
