import { format, differenceInCalendarDays } from "date-fns";
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

  saveTaskList() {
    localStorage.setItem(`${this.name}Tasks`, JSON.stringify(this.#taskList));
  }

  initializeTaskList() {
    this.#taskList = [];
    const retrievedTasks = localStorage.getItem(`${this.name}Tasks`);
    if (retrievedTasks) {
      const tasksToPush = JSON.parse(retrievedTasks);
      if (tasksToPush[0] === "No tasks set!" && tasksToPush.length > 1) {
        tasksToPush.shift();
      }
      tasksToPush.forEach((task) => {
        if (task !== "No tasks set!") {
          const taskClass = new Task(task.title, task.dueDate);
          if (task.completed == true) {
            taskClass.markAsCompleted();
          }
          this.#taskList.push(taskClass);
        }
      });
    } else {
      this.#taskList.push("No tasks set!");
    }
  }

  get taskList() {
    return this.#taskList;
  }

  getSpecificTask(name) {
    for (let index = 0; index < this.#taskList.length; index++) {
      if ((this.#taskList[index].title = name)) {
        return this.#taskList[index];
      }
    }
  }

  addNewTask(task, dueDate) {
    try {
      const newTask = new Task(task, dueDate);
      this.#taskList.push(newTask);
      localStorage.setItem(`${this.name}Tasks`, JSON.stringify(this.#taskList));
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }

  removeTask(task) {
    this.#taskList.splice(task, 1);
  }
}

const projectList = (function () {
  let projects = [];
  getProjectsFromStorage();

  function addProject(newProject) {
    projects.push(newProject);
    const projectToSave = JSON.stringify(projects);
    localStorage.setItem("projects", projectToSave);
    getProjectsFromStorage();
  }

  function getProjectsFromStorage() {
    projects = [];
    const retrievedProjects = localStorage.getItem("projects");
    const projectsToPush = JSON.parse(retrievedProjects);
    if (projectsToPush === null) {
      return;
    }
    projectsToPush.forEach((project) => {
      const projectClass = new Project(project.name);
      projects.push(projectClass);
    });
  }

  function getSpecificProject(name) {
    for (let index = 0; index < projectList.projects.length; index++) {
      if (projectList.projects[index].name === name) {
        return projectList.projects[index];
      }
    }
  }

  return { projects, addProject, getSpecificProject };
})();

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
      displayTasks(project, newProjectCard);
      projectCardBox.appendChild(newProjectCard);
      addNewTaskButton(newProjectCard);
    });
  }

  function displayTasks(project, cardToAppend) {
    project.initializeTaskList();
    for (let index = 0; index < project.taskList.length; index++) {
      console.log(project.taskList);
      const taskDiv = document.createElement("div");
      if (project.taskList[index] == "No tasks set!") {
        taskDiv.innerHTML = `${project.taskList[index]}`;
        cardToAppend.appendChild(taskDiv);
        return;
      }
      project.taskList[index].completed == true
        ? taskDiv.classList.add("tasks-div", "completed")
        : taskDiv.classList.add("tasks-div");
      taskDiv.innerHTML = `
      <div>
      ${project.taskList[index].title}: to be done by: ${project.taskList[index].dueDate}
      </div>
      `;
      addCheckBox(project.taskList[index], taskDiv, project);
      cardToAppend.appendChild(taskDiv);
    }
  }

  function addCheckBox(task, taskDivToAddCheckBox, project) {
    const checkBoxDiv = document.createElement("div");
    if (task.completed == true) {
      checkBoxDiv.innerHTML = `
        <input type="checkbox" id="${task.title}" name="completion" value="${project.name}" checked>
        <label for="completion"> Days left: ${task.remainingDays}</label>
        `;
      taskDivToAddCheckBox.appendChild(checkBoxDiv);
    } else {
      checkBoxDiv.innerHTML = `
      <input type="checkbox" id="${task.title}" name="completion" value="${project.name}">
      <label for="completion"> Days left: ${task.remainingDays}</label>
      `;
      taskDivToAddCheckBox.appendChild(checkBoxDiv);
    }
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
      let tempProject = prompt("What are you trying to do?");
      if (tempProject == null || undefined || "") {
        return;
      }
      tempProject = new Project(tempProject);
      projectList.addProject(tempProject);
      initializeScreen();
    });
  }

  function createTaskbuttons() {
    for (let index = 0; index < taskButton.length; index++) {
      taskButton[index].addEventListener("click", () => {
        const projectToAddTask = projectList.projects[index];
        const task = prompt("What goal do you need to accomplish?");
        const date = prompt("When should you have it done by?");
        projectToAddTask.addNewTask(task, date);
        initializeScreen();
      });
    }
  }

  function completionChecker() {
    const completionCheckbox = document.querySelectorAll(
      "input[name=completion]"
    );
    for (let index = 0; index < completionCheckbox.length; index++) {
      completionCheckbox[index].addEventListener("change", (e) => {
        const tempProject = projectList.getSpecificProject(e.target.value);
        const task = tempProject.getSpecificTask(e.target.id);
        e.target.checked ? task.markAsCompleted() : task.markAsCompleted();
        tempProject.saveTaskList();
        initializeScreen();
      });
    }
  }

  function initializeScreen() {
    currentScreen.displayProjects();
    createNewProjectButton();
    createTaskbuttons();
    completionChecker();
  }

  return { initializeScreen };
})();

clickHandler.initializeScreen();
