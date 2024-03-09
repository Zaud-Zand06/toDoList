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
    this.#taskList.push(newTask);
  }

  removeTask(task) {
    this.#taskList.splice(task, 1);
  }
}

const projectList = (function () {
  const projects = [];

  function addProject(newProject) {
    projects.push(newProject);
  }

  return { projects, addProject };
})();

const getMoney = new Project("Get Money");
projectList.addProject(getMoney);
console.log(projectList.projects);
getMoney.addNewTask("Finish TOP", "oct 21 2025");
getMoney.addNewTask("break the world", "dec 14 2024");
getMoney.addNewTask("hit new pr", "apr 17 2026");

function theScreen() {
  const siteBody = document.querySelector(".site-body");
  const projectCardBox = document.querySelector(".project-card-box");

  function clearSiteBody() {
    siteBody.innerHTML = "";
  }

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
        projectTask.innerHTML = `${task.title}`;
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
  currentScreen.displayProjects();
  const button = document.getElementById("new-project-button");
  button.addEventListener("click", () => {
    let tempProject = new Project(prompt("What are you trying to do?"));
    projectList.addProject(tempProject);
    currentScreen.displayProjects();
  });
  const taskButton = document.getElementsByClassName("new-task-button");
  for (let button of taskButton) {
    button.addEventListener("click", (e) => {
      console.log(e);
    });
  }
})();
