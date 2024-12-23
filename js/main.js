console.log("Hello! It's a last version."); 

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".todo__form");
    const input = document.querySelector(".todo__input");
    const list = document.querySelector(".todo__list");
    const tasksForm = document.querySelector(".todo__tasks-form");
    loadFromLocalStorage()
    
    // Додавання нового завдання
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Зупиняємо перезавантаження сторінки
        const taskText = input.value.trim();
        if (taskText === "") return; // Перевіряємо, чи основне поле вводу не пусте

        const task = createTaskElement(taskText, list, tasksForm);
        list.appendChild(task);
        input.value = ""; // Очищення поля вводу

        tasksForm.style.display = "block"; // Показати форму зі списком завдань

        saveToLocalStorage(); // Викликаємо тут після змін
    });

    function createTaskHTML(text) { // без saveToLocalStorage() 
        const li = document.createElement("li");
        li.className = "todo__item";
    
        // Контейнер завдання
        const taskContainer = document.createElement("div");
        taskContainer.className = "todo__task-container";
        taskContainer.innerHTML = `
            <span class="todo__task-text">${text}</span>
            <button type="button" class="todo__complete-button">Complete</button>
            <button type="button" class="todo__important-button">Important</button>
            <button type="button" class="todo__edit-button">Edit</button>
            <button type="button" class="todo__add-subtask-button">Add Subtask</button>
            <button type="button" class="todo__delete-button">Delete</button>
        `;
    
        // Контейнер для підзадач
        const subtaskContainer = document.createElement("div");
        subtaskContainer.className = "todo__subtask-container";
    
        const subtaskList = document.createElement("ul");
        subtaskList.className = "todo__subtask-list";
        subtaskContainer.appendChild(subtaskList);
    
        // Додаємо обидва контейнери до завдання
        li.appendChild(taskContainer);
        li.appendChild(subtaskContainer);
    
        return li;
    }
    
    // 2. Додає обробники подій для кнопок завдання
    function addTaskEventListeners(li, list, tasksForm) {
        const taskTextElement = li.querySelector(".todo__task-text");

        // Позначити виконаним
        li.querySelector(".todo__complete-button").addEventListener("click", (event) => {
            event.stopPropagation();
            taskTextElement.classList.toggle("todo__task-text--completed"); 

            saveToLocalStorage();
        });

        // Позначити важливим
        li.querySelector(".todo__important-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.classList.toggle("todo__item--important"); 

            saveToLocalStorage();
        });

        // Редагування
        li.querySelector(".todo__edit-button").addEventListener("click", (event) => {
            event.stopPropagation();
            editTaskText(li); 

            saveToLocalStorage();
        });

        // Додавання підзадач
        li.querySelector(".todo__add-subtask-button").addEventListener("click", (event) => {
            event.stopPropagation();
            addSubtask(li); 

            saveToLocalStorage();
        });

        // Видалення
        li.querySelector(".todo__delete-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.remove();
            if (!list.children.length) {
                tasksForm.style.display = "none";
            } 

            saveToLocalStorage();
        });
    }

    // 3. Функція для редагування тексту завдання
    function editTaskText(li) {
        const taskTextElement = li.querySelector(".todo__task-text");
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = taskTextElement.textContent.trim();
        inputField.className = "todo__input-field";

        taskTextElement.replaceWith(inputField);

        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const newText = inputField.value.trim();
                if (newText !== "") {  // Оновлюємо текст завдання
                    taskTextElement.textContent = newText;
                    inputField.replaceWith(taskTextElement); 

                    saveToLocalStorage();  // Зберігаємо зміни в Local Storage 
                }
            } else if (event.key === "Escape") {  // Повертаємо оригінальний текст, якщо натиснуто Escape 
                inputField.replaceWith(taskTextElement);
            }
        });
    }

    // Редагування тексту підзавдання
    function editSubtaskText(li) {
        const taskTextElement = li.querySelector(".todo__task-text");
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = taskTextElement.textContent.trim();
        inputField.className = "todo__input-field";

        taskTextElement.replaceWith(inputField);  // Замінюємо текстовий елемент на поле вводу 

        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {  
                const newText = inputField.value.trim();
                if (newText !== "") {  // Оновлюємо текст підзавдання 
                    taskTextElement.textContent = newText;
                    inputField.replaceWith(taskTextElement); 

                    saveToLocalStorage();  // Зберігаємо зміни в Local Storage 
                }
            } else if (event.key === "Escape") {  // Повертаємо оригінальний текст, якщо натиснуто Escape 
                inputField.replaceWith(taskTextElement);
            }
        });
    }

    // 4. Функція для додавання підзадач
    function addSubtask(li) {
        const subtaskContainer = li.querySelector(".todo__subtask-container");
        const subtaskList = subtaskContainer.querySelector(".todo__subtask-list");
    
        // Поле для введення підзадачі
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Enter subtask...";
        inputField.className = "todo__subtask-input";
        subtaskContainer.appendChild(inputField);
        inputField.focus();
    
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const subtaskText = inputField.value.trim();
                if (subtaskText) {  // Створюємо та додаємо нову підзадачу  
                    const subtaskItem = createSubtaskElement(subtaskText);
                    subtaskList.appendChild(subtaskItem); 

                    saveToLocalStorage(); // Зберігаємо зміни в Local Storage  

                    inputField.remove();
                }
            } else if (event.key === "Escape") {  // Видаляємо поле вводу, якщо натиснуто Escape
                inputField.remove();
            }
        });
    }

    // Створює HTML-елемент для підзадачі
    function createSubtaskElement(text) {
        const li = document.createElement("li");
        li.className = "todo__subtask-item";
        li.innerHTML = `
            <span class="todo__task-text">${text}</span>
            <button type="button" class="todo__complete-button">Complete</button>
            <button type="button" class="todo__important-button">Important</button>
            <button type="button" class="todo__edit-button">Correct</button>
            <button type="button" class="todo__delete-button">Delete</button>
        `;

        // Позначити виконаним
        li.querySelector(".todo__complete-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.querySelector(".todo__task-text").classList.toggle("todo__task-text--completed"); 

            saveToLocalStorage(); // Зберегти зміни в Local Storage  
        });

        // Позначити важливим
        li.querySelector(".todo__important-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.classList.toggle("todo__subtask--important"); 

            saveToLocalStorage(); // Зберегти зміни в Local Storage
        });

        // Редагування
        li.querySelector(".todo__edit-button").addEventListener("click", (event) => {
            event.stopPropagation();
            editSubtaskText(li); 

            // saveToLocalStorage(); 
            // Зберегти зміни в Local Storage після редагування, !!!!!!!!!!!!!!
        });

        // Видалення
        li.querySelector(".todo__delete-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.remove(); 

            saveToLocalStorage(); // Зберегти зміни в Local Storage після видалення 
        });

        return li;
    }

    // 6. Основна функція для створення завдання
    function createTaskElement(text, list, tasksForm) {
        const li = createTaskHTML(text);  // Створюємо HTML елемент для завдання
        addTaskEventListeners(li, list, tasksForm);  // Додаємо слухачі подій 

        list.appendChild(li); // Додаємо завдання до списку, !!!!!!!!!!!!!

        saveToLocalStorage();  // Зберігаємо зміни в Local Storage

        return li;
    }
    
    function createTaskElementWithoutSaving(text, list, tasksForm) {
        console.log("Створення завдання без збереження:", text);
        const li = createTaskHTML(text); // Створюємо HTML елемент для завдання
        addTaskEventListeners(li, list, tasksForm); // Додаємо слухачі подій
        list.appendChild(li); // Додаємо завдання до списку
        return li; // Повертаємо елемент, але не зберігаємо
    }

    function debugLocalStorage() {
        console.log("Local Storage Debug:");
        console.log("Збережені дані:", localStorage.getItem("todoList"));
        console.log("Поточний DOM:", document.querySelector(".todo__list").innerHTML);
    }

    // // Функція для збереження даних у Local Storage
    function saveToLocalStorage() {
        const tasks = Array.from(list.children).map(task => {
            const taskText = task.querySelector(".todo__task-text").textContent.trim();
            const isImportant = task.classList.contains("todo__item--important");
            const isCompleted = task.querySelector(".todo__task-text").classList.contains("todo__task-text--completed");

            const subtasks = Array.from(task.querySelectorAll(".todo__subtask-item")).map(subtask => ({
                text: subtask.querySelector(".todo__task-text").textContent.trim(),
                important: subtask.classList.contains("todo__subtask--important"),
                completed: subtask.querySelector(".todo__task-text").classList.contains("todo__task-text--completed"),
            }));

            return { text: taskText, important: isImportant, completed: isCompleted, subtasks };
        });


        console.log(tasks); // Перевірте, що ви зберігаєте в Local Storage
        localStorage.setItem("todoList", JSON.stringify(tasks));
    }    
    
    // New loadFromLocalStorage()
    function loadFromLocalStorage() {
        const savedTasks = localStorage.getItem("todoList");
        const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
        if (tasks.length > 0) {
            // Створюємо кнопку для очищення Local Storage, якщо її немає
            if (!document.getElementById("clearStorageButton")) {
                const clearButton = document.createElement("button");
                clearButton.id = "clearStorageButton";
                clearButton.textContent = "Clear Storage";
                document.body.appendChild(clearButton);
    
                clearButton.addEventListener("click", () => {
                    localStorage.clear();
                    list.innerHTML = "";
                    tasksForm.style.display = "none";
                    clearButton.style.display = "none"; // Сховати кнопку після очищення
                });
            }
        }
    
        // Відновлення завдань із Local Storage
        tasks.forEach(task => {
            const taskElement = createTaskElementWithoutSaving(task.text, list, tasksForm);
    
            // Відновлення підзадач
            task.subtasks.forEach(subtask => {
                const subtaskElement = createSubtaskElement(subtask.text);
    
                if (subtask.important) {
                    subtaskElement.classList.add("todo__subtask--important");
                }
    
                if (subtask.completed) {
                    subtaskElement.querySelector(".todo__task-text").classList.add("todo__task-text--completed");
                }
    
                // Додаємо підзадачу до списку підзадач батьківського завдання
                taskElement.querySelector(".todo__subtask-list").appendChild(subtaskElement);
            });
        });
    
        addClearButton(); 

        // Показуємо форму, якщо є завдання
        tasksForm.style.display = tasks.length > 0 ? "block" : "none";
    }
     
    function addClearButton() {
        const clearButton = document.querySelector(".todo__clear-button");
        if (!clearButton) {
            const button = document.createElement("button");
            button.textContent = "Clear";
            button.classList.add("todo__clear-button");
            button.addEventListener("click", () => {
                localStorage.clear();
                list.innerHTML = "";
                tasksForm.style.display = "none";
            });
    
            button.style.position = "fixed";  // Фіксувати кнопку
            button.style.top = "10px";  // Відступ зверху
            button.style.left = "10px";  // Відступ зліва
            button.style.padding = "0.5rem 1rem";  // Стиль padding, як у Add Task
            button.style.backgroundColor = "#28a745";  // Той самий зелений, як у Add Task
            button.style.color = "white";  // Білий текст
            button.style.border = "none";  // Без обводки
            button.style.borderRadius = "5px";  // Округлення кутів
            button.style.fontSize = "16px";  // Розмір шрифта
            button.style.cursor = "pointer";  // Курсор при наведенні
            button.style.zIndex = "1000";  // Забезпечує, щоб кнопка була на передньому плані

    
            // Стиль при наведенні
            button.addEventListener("mouseover", () => {
                button.style.backgroundColor = "#218838";  // Той самий темно-зелений, як у Add Task
            });
    
            button.addEventListener("mouseout", () => {
                button.style.backgroundColor = "#28a745";  // Повертаємо оригінальний зелений
            });
    
            // Додаємо кнопку в контейнер
            const buttonContainer = document.querySelector(".todo__button-container");
            if (buttonContainer) {
                buttonContainer.appendChild(button);
            } else {
                console.error("Контейнер для кнопки 'Clear' не знайдено.");
            }
        }
    }
    
    function updateTasksFormVisibility() {
        tasksForm.style.display = list.children.length > 0 ? "block" : "none";
    }
    
    // Ensure tasks section is always visible with a title
    const taskListHeader = document.createElement("h2");
    taskListHeader.textContent = "Task List";
    taskListHeader.style.marginTop = "1rem";
    tasksForm.parentNode.insertBefore(taskListHeader, tasksForm);
    tasksForm.style.display = "none"; // Hide initially
});


