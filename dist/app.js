"use strict";
/// <reference path="app.d.ts" />
var STATE = {
    tasks: [],
};
if (localStorage.getItem("tasks")) {
    STATE.tasks = JSON.parse(localStorage.getItem("tasks"));
}
function init(STATE) {
    buildTaskList(STATE);
    var newTaskForm = document.querySelector("#new-task-form");
    var newTaskInput = (newTaskForm.querySelector("#add-task-input"));
    var newTaskButton = (newTaskForm.querySelector("#add-task-button"));
    newTaskInput.addEventListener("keyup", function (event) {
        var target = event.target;
        if (target.value) {
            newTaskButton.disabled = false;
        }
        else {
            newTaskButton.disabled = true;
        }
    });
    newTaskForm.addEventListener("submit", function (event) {
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
function buildTaskList(STATE) {
    var taskList = document.querySelector("#task-list");
    taskList.innerHTML = "";
    STATE.tasks.forEach(function (task) {
        var taskTemplate = (document.querySelector("#task-template"));
        var taskElement = (taskTemplate.content.firstElementChild.cloneNode(true));
        var taskTitle = taskElement.querySelector(".task__title");
        var taskCompleteButton = (taskElement.querySelector(".task__complete-button"));
        var taskRemoveButton = (taskElement.querySelector(".task__remove-button"));
        if (task.completed) {
            taskElement.classList.add("task--completed");
            taskCompleteButton.disabled = true;
        }
        else {
            taskCompleteButton.addEventListener("click", function () {
                task.completed = true;
                taskElement.classList.add("task--completed");
                taskCompleteButton.disabled = true;
                saveTasksToLocalStorage(STATE.tasks);
            });
        }
        taskRemoveButton.addEventListener("click", function () {
            STATE.tasks = STATE.tasks.filter(function (t) { return t.task !== task.task; });
            buildTaskList(STATE);
            saveTasksToLocalStorage(STATE.tasks);
        });
        taskTitle.innerText = task.task;
        taskList.appendChild(taskElement);
    });
}
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
init(STATE);
