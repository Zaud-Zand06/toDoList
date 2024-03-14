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

  get taskList() {
    this.#taskList = [];
    this.getTasksFromStorage();
    return this.#taskList;
  }

  addNewTask(task, dueDate) {
    const newTask = new Task(task, dueDate);
    this.#taskList.push(newTask);
    localStorage.setItem(`${this.name}Tasks`, JSON.stringify(this.#taskList));
  }

  getTasksFromStorage() {
    const retrievedTasks = localStorage.getItem(`${this.name}Tasks`);
    if (retrievedTasks != null) {
      const tasksToPush = JSON.parse(retrievedTasks);
      if (tasksToPush[0] == "No tasks set!" && tasksToPush.length > 1) {
        tasksToPush.splice(0, 1);
        this.#taskList.push(tasksToPush[0]);
        return;
        // all other tasks added
        // add task methonds back to tasks we pull from local storage
      } else if (tasksToPush[0] != "No tasks set!") {
        tasksToPush.forEach((task) => {
          this.#taskList.push(task);
        });
        return;
      }
    } else {
      this.#taskList.push("No tasks set!");
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
    console.log(projectsToPush);
    projectsToPush.forEach((project) => {
      if (project === null) {
        return;
      }
      const projectClass = new Project(project.name);
      projects.push(projectClass);
    });
  }

  return { projects, addProject };
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
    const tasksToDisplay = project.taskList;
    tasksToDisplay.forEach((task) => {
      const taskDiv = document.createElement("div");
      // if empty task list
      if (task.title == undefined) {
        taskDiv.innerHTML = `${task}`;
        cardToAppend.appendChild(taskDiv);

        return;
      }
      taskDiv.classList.add("tasks-div");
      taskDiv.innerHTML = `
      <div>
      ${task.title}: to be done by: ${task.dueDate}
      </div>
      <div>
      <input type="checkbox" id="completion" name="completion" value="Completed">
      <label for="completion"> Days left: ${task.remainingDays}</label>
      </div>
`;
      cardToAppend.appendChild(taskDiv);
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
      let tempProject = prompt("What are you trying to do?");
      if (tempProject == null || undefined || "") {
        return;
      }
      tempProject = new Project(tempProject);
      projectList.addProject(tempProject);
      initializeScreen();
    });
  }

  //something strange is brewing here....
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

  // function createSaveProjectsButton() {
  //   const saveProjectsButton = document.getElementById("save-project-button");
  //   saveProjectsButton.addEventListener("click", () => {});
  // }

  function initializeScreen() {
    currentScreen.displayProjects();
    createNewProjectButton();
    createTaskbuttons();
  }

  return { initializeScreen };
})();

clickHandler.initializeScreen();
