import { format, differenceInCalendarDays, parse } from "date-fns";
import "./style.css";

const currentDate = format(new Date(), "MM-dd-yyyy");

class Task {
  description;
  constructor(task, date) {
    this.title = task;
    this.dueDate = format(date, "MM-dd-yyyy");
    this.completed = false;
    this.remainingDays = differenceInCalendarDays(this.dueDate, currentDate);
    this.important = false;
  }

  changeTask(newTask) {
    this.title = newTask;
  }

  changeDueDate(newDueDate) {
    this.dueDate = format(newDueDate, "MM-dd-yyyy");
  }

  markAsCompleted() {
    this.completed = !this.completed;
  }

  markAsImportant() {
    this.important = !this.important;
  }

  addDescription(description) {
    this.description = description;
  }
}

class Project {
  #taskList = [];

  constructor(name) {
    this.name = name;
  }

  get taskList() {
    return this.#taskList > 0 ? this.#taskList : "No project goals set!";
  }

  addNewTask(task, dueDate) {
    const newTask = new Task(task, dueDate);
    this.#taskList.push(newTask);
  }

  removeTask(task) {
    this.#taskList.splice(task, 1);
  }
}

const theScreen = function () {
  const siteBody = document.getElementsByClassName("site-body")[0];
  const taskListBody = document.getElementsByClassName("task-list-body");
  const projectList = [];
  let tempProject = "";

  const newProjectButton = function () {
    const button = document.createElement("a");
    button.innerHTML = `Start a new project? :3`;
    button.id = "add-new-project-button";
    siteBody.appendChild(button);
    button.addEventListener("click", () => {
      tempProject = new Project(prompt("What are you trying to do?"));
      projectList.push(tempProject);
      checkForProjects();
    });
  };

  const checkForProjects = () => {
    projectList.length > 0 ? updateProjects() : newProjectButton();
  };

  function addNewTask() {
    const task = prompt("Whats our first goal?");
    const date = prompt("When do you want this done?");
    tempProject.addNewTask(task, date);
    console.log(tempProject.task);
    updateProjects();
  }

  function updateProjects() {
    siteBody.innerHTML = "";
    projectList.forEach(() => {
      const projectCard = document.createElement("div");
      projectCard.innerHTML = `
        <h3>
        ${tempProject.name}
        </h3>
        <div>
        ${tempProject.taskList}
        </div>
      `;
      console.log(projectList);
      const newProjTaskButton = document.createElement("a");
      newProjTaskButton.id = "new-project-task-button";
      newProjTaskButton.innerHTML = "click to add tasks";
      projectCard.appendChild(newProjTaskButton);
      newProjTaskButton.addEventListener("click", () => {
        addNewTask();
      });
      projectCard.classList.add("project-card");
      siteBody.appendChild(projectCard);
    });
    newProjectButton();
  }

  return { checkForProjects, updateProjects };
};

function screenHandler() {
  const theScreen = theScreen();
  theScreen.checkForProjects();
  function makeNewProjectTaskButton() {
    const newProjTaskButton = document.createElement("a");
    newProjTaskButton.id = "new-project-task-button";
    newProjTaskButton.innerHTML = "click to add tasks";
  }
}

screenHandler();
