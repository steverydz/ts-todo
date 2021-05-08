/// <reference path="app.d.ts" />

const STATE = {
  tasks: [],
};

if (localStorage.getItem("tasks")) {
  STATE.tasks = JSON.parse(localStorage.getItem("tasks")!);
}

function init(STATE: State) {
  buildTaskList(STATE);

  const newTaskForm = <HTMLFormElement>document.querySelector("#new-task-form");

  const newTaskInput = <HTMLInputElement>(
    newTaskForm.querySelector("#add-task-input")
  );

  const newTaskButton = <HTMLButtonElement>(
    newTaskForm.querySelector("#add-task-button")
  );

  newTaskInput.addEventListener("keyup", (event) => {
    const target = <HTMLInputElement>event.target;

    if (target.value) {
      newTaskButton.disabled = false;
    } else {
      newTaskButton.disabled = true;
    }
  });

  newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    STATE.tasks.push({
      completed: false,
      dateAdded: new Date(),
      task: newTaskInput.value,
    });

    newTaskInput.value = "";
    newTaskButton.disabled = true;

    buildTaskList(STATE);
    saveTasksToLocalStorage(STATE.tasks);
  });
}

function buildTaskList(STATE: State) {
  const taskList = <HTMLDivElement>document.querySelector("#task-list");

  taskList.innerHTML = "";

  STATE.tasks.forEach((task: Task) => {
    const taskTemplate = <HTMLTemplateElement>(
      document.querySelector("#task-template")
    );

    const taskElement = <HTMLDivElement>(
      taskTemplate.content.firstElementChild!.cloneNode(true)
    );

    const taskTitle = <HTMLDivElement>taskElement.querySelector(".task__title");

    const taskCompleteButton = <HTMLButtonElement>(
      taskElement.querySelector(".task__complete-button")
    );

    const taskRemoveButton = <HTMLButtonElement>(
      taskElement.querySelector(".task__remove-button")
    );

    if (task.completed) {
      taskElement.classList.add("task--completed");
      taskCompleteButton.disabled = true;
    } else {
      taskCompleteButton.addEventListener("click", () => {
        task.completed = true;
        taskElement.classList.add("task--completed");
        taskCompleteButton.disabled = true;
        saveTasksToLocalStorage(STATE.tasks);
      });
    }

    taskRemoveButton.addEventListener("click", () => {
      STATE.tasks = STATE.tasks.filter((t) => t.task !== task.task);
      buildTaskList(STATE);
      saveTasksToLocalStorage(STATE.tasks);
    });

    taskTitle.innerText = task.task;
    taskList.appendChild(taskElement);
  });
}

function saveTasksToLocalStorage(tasks: Array<Task>) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

init(STATE);
