// Clase para los nodos de la lista
class TaskNode {
    constructor(task) {
        this.task = task;
        this.completed = false;
        this.next = null;
    }
}

// Clase para la lista enlazada simple
class TaskList {
    constructor() {
        this.head = null;
    }

    addTask(task) {
        const newNode = new TaskNode(task);
        if (!this.head) {
            this.head = newNode;
        } else {
            let currentNode = this.head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = newNode;
        }
        this.saveTasks();
    }

    deleteTask(node) {
        if (this.head === node) {
            this.head = node.next;
        } else {
            let currentNode = this.head;
            while (currentNode && currentNode.next !== node) {
                currentNode = currentNode.next;
            }
            if (currentNode && currentNode.next === node) {
                currentNode.next = node.next;
            }
        }
        this.saveTasks();
    }

    markCompleted(node) {
        node.completed = !node.completed;
        this.saveTasks();
    }

    saveTasks() {
        const tasks = [];
        let currentNode = this.head;
        while (currentNode) {
            tasks.push({ task: currentNode.task, completed: currentNode.completed });
            currentNode = currentNode.next;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskData => {
            const newNode = new TaskNode(taskData.task);
            newNode.completed = taskData.completed;
            if (!this.head) {
                this.head = newNode;
            } else {
                let currentNode = this.head;
                while (currentNode.next) {
                    currentNode = currentNode.next;
                }
                currentNode.next = newNode;
            }
        });
    }
}

// Inicialización
const taskList = new TaskList();
taskList.loadTasks();
renderTasks();

document.getElementById('addTaskButton').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (task) {
        taskList.addTask(task);
        taskInput.value = '';
        renderTasks();
    }
});

function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';
    let currentNode = taskList.head;
    while (currentNode) {
        const li = document.createElement('li');
        li.className = 'task';
        if (currentNode.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span>${currentNode.task}</span>
            <input type="checkbox" ${currentNode.completed ? 'checked' : ''}>
            <button class="deleteButton">Eliminar</button>
        `;
        li.querySelector('input').addEventListener('change', () => {
            taskList.markCompleted(currentNode);
            renderTasks();
        });
        li.querySelector('.deleteButton').addEventListener('click', () => {
            taskList.deleteTask(currentNode);
            renderTasks();
        });
        taskListElement.appendChild(li);
        currentNode = currentNode.next;
    }
}
