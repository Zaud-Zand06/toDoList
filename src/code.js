import { format, differenceInCalendarDays, parse } from "date-fns";
import "./style.css";

// this vid for accordion https://www.youtube.com/watch?v=B_n4YONte5A&list=PL4-IK0AVhVjNcjfYDQEseNxuarDjSEdZK

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
    return this.#taskList;
  }

  addNewTask(task, dueDate) {
    const newTask = new Task(task, dueDate);
    const taskToSave = JSON.stringify(newTask);
    localStorage.setItem("tasks", taskToSave);
    this.#taskList.push(newTask);
  }

  getTasksFromStorage() {
    const retrievedTasks = localStorage.getItem("tasks");
    const tasksToPush = [JSON.parse(retrievedTasks)];
    if (tasksToPush.length <= 0) {
      return "No tasks set!";
    }
    tasksToPush.forEach((task) => {
      this.#taskList.push(task);
    });
  }

  removeTask(task) {
    this.#taskList.splice(task, 1);
  }
}

const projectList = (function () {
  const projects = [];
  getProjectsFromStorage();

  function addProject(newProject) {
    projects.push(newProject);
    const projectToSave = JSON.stringify(newProject);
    localStorage.setItem("projects", projectToSave);
    getProjectsFromStorage();
  }

  function getProjectFromList(nameOfProject) {
    const projectToReturn = projects.find(
      (proj) => proj.name === nameOfProject
    );
    return projectToReturn;
  }

  function getProjectsFromStorage() {
    const retrievedProjects = localStorage.getItem("projects");
    const projectsToPush = [JSON.parse(retrievedProjects)];
    console.log(projectsToPush);
    if (projectsToPush.length <= 0) {
      return;
    }
    projectsToPush.forEach((project) => {
      const projectClass = new Project(project.name);
      projects.push(projectClass);
    });
  }

  function removeProjectFromStorage(project) {
    Storage.removeItem(project);
  }

  function clearProjectsFromStorage() {
    localStorage.clear();
  }

  return { projects, addProject, getProjectFromList, getProjectsFromStorage };
})();

console.log(projectList.projects);

// const getMoney = new Project("Get Money");
// projectList.addProject(getMoney);
// getMoney.addNewTask("Finish TOP", "oct 21 2025");
// getMoney.addNewTask("break the world", "dec 14 2024");
// getMoney.addNewTask("hit new pr", "apr 17 2026");
// console.log(projectList.projects);

function theScreen() {
  const projectCardBox = document.querySelector(".project-card-box");

  function displayProjects() {
    projectCardBox.innerHTML = "";
    projectList.projects.forEach((project) => {
      const newProjectCard = document.createElement("div");
      newProjectCard.classList.add("project-card-div");
      const projectH1 = document.createElement("h1");
      projectH1.innerHTML = `${project.name}`;
      newProjectCard.appendChild(projectH1);
      project.taskList.forEach((task) => {
        const projectTask = document.createElement("div");
        projectTask.innerHTML = `${task.title} done by ${task.dueDate}`;
        newProjectCard.appendChild(projectTask);
      });
      if (project.taskList.length == 0) {
        const noTaskMessage = document.createElement("p");
        noTaskMessage.innerHTML = "You dont have any goals yet...";
        newProjectCard.appendChild(noTaskMessage);
      }
      projectCardBox.appendChild(newProjectCard);
      addNewTaskButton(newProjectCard);
    });
  }

  function addNewTaskButton(projectCardDiv) {
    const newTaskButton = document.createElement("a");
    newTaskButton.classList.add("new-task-button");
    newTaskButton.innerHTML = "add a task!";
    projectCardDiv.appendChild(newTaskButton);
  }

  return { displayProjects, addNewTaskButton };
}

const clickHandler = (function () {
  const currentScreen = theScreen();
  const projectButton = document.getElementById("new-project-button");
  const taskButton = document.getElementsByClassName("new-task-button");

  function createNewProjectButton() {
    projectButton.addEventListener("click", () => {
      let tempProject = new Project(prompt("What are you trying to do?"));
      projectList.addProject(tempProject);
      initializeScreen();
    });
  }

  function createTaskbuttons() {
    for (let button of taskButton) {
      button.addEventListener("click", (e) => {
        const projectName = button.parentNode.firstChild.innerHTML;
        const projectToAddTask = projectList.getProjectFromList(projectName);
        const task = prompt("What goal do you need to accomplish?");
        const date = prompt("When should you have it done by?");
        projectToAddTask.addNewTask(task, date);
        initializeScreen();
      });
    }
  }

  function initializeScreen() {
    currentScreen.displayProjects();
    createNewProjectButton();
    createTaskbuttons();
  }

  initializeScreen();
})();
