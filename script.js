document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const clearAllButton = document.getElementById('clear-all');

    // Load tasks from local storage
    loadTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTask(taskText);
            todoInput.value = '';
        }
    });

    clearAllButton.addEventListener('click', () => {
        todoList.innerHTML = '';
        saveTasks();
    });

    function addTask(taskText, isCompleted = false) {
        const taskItem = document.createElement('li');
        taskItem.className = 'bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow';

        const taskContent = document.createElement('div');
        taskContent.className = 'flex-1';

        const taskTextEl = document.createElement('span');
        taskTextEl.textContent = taskText;

        if (isCompleted) {
            taskTextEl.classList.add('line-through', 'text-sky-600', 'font-semibold');
        }

        taskContent.appendChild(taskTextEl);

        const actionButtons = document.createElement('div');
        actionButtons.className = 'flex space-x-2';

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        editButton.className = 'bg-sky-600 text-white px-3 py-1 rounded-lg hover:bg-sky-500 transition duration-300';
        editButton.addEventListener('click', () => editTask(taskItem, taskContent, editButton, completeButton));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.className = 'bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300';
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasks(); // Save tasks after deletion
        });

        const completeButton = document.createElement('button');
        completeButton.innerHTML = isCompleted ? '<i class="fa-solid fa-rotate-left"></i>' : '<i class="fa-solid fa-check"></i>';
        completeButton.className = 'bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300';
        completeButton.addEventListener('click', () => markComplete(taskTextEl, completeButton));

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);
        actionButtons.appendChild(completeButton);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(actionButtons);

        todoList.appendChild(taskItem);
        saveTasks(); // Save tasks after adding a new one
    }

    function editTask(taskItem, taskContent, editButton, completeButton) {
        const taskTextEl = taskContent.querySelector('span:first-child');
        if (editButton.querySelector('i').classList.contains('fa-pen-to-square')) {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = taskTextEl.textContent;
            inputField.className = 'w-full p-1 border border-gray-300 rounded focus:outline-none';
            inputField.focus();
            taskTextEl.replaceWith(inputField);
            editButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        } else {
            const newText = taskContent.querySelector('input').value.trim();
            const newSpan = document.createElement('span');
            newSpan.textContent = newText;
            taskContent.querySelector('input').replaceWith(newSpan);
            editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

            // Re-attach the event listener to the new task text element
            completeButton.removeEventListener('click', markComplete); // Remove the old listener
            completeButton.addEventListener('click', () => markComplete(newSpan, completeButton));
            saveTasks(); // Save tasks after editing
        }
    }

    function markComplete(taskTextEl, completeButton) {
        taskTextEl.classList.toggle('line-through');
        taskTextEl.classList.toggle('text-sky-600');
        taskTextEl.classList.toggle('font-semibold');
        completeButton.innerHTML = taskTextEl.classList.contains('line-through')
            ? '<i class="fa-solid fa-rotate-left"></i>'
            : '<i class="fa-solid fa-check"></i>';
        saveTasks(); // Save tasks after marking as complete
    }

    function saveTasks() {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(taskItem => {
            const taskText = taskItem.querySelector('span:first-child').textContent;
            const isCompleted = taskItem.querySelector('span:first-child').classList.contains('line-through');
            tasks.push({ taskText, isCompleted });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.taskText, task.isCompleted);
        });
    }
});



