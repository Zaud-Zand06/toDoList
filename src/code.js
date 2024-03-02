import { format, differenceInCalendarDays, parse } from "date-fns";

const currentDate = format(new Date(), "MM-dd-yyyy");

class Task {
  #task;
  #date;

  constructor(task, date) {
    this.#task = task;
    this.#date = format(date, "MM-dd-yyyy");
    this.completed = false;
    this.remainingDays = differenceInCalendarDays(this.#date, currentDate);
    this.important = false;
  }

  get task() {
    return this.#task;
  }

  set task(newTask) {
    this.#task = newTask;
  }

  get date() {
    return this.#date;
  }

  set date(newDate) {
    let tempDate = format(newDate, "MM-dd-yyyy");
    this.#date = tempDate;
  }

  getCompletedStatus() {
    return this.completed;
  }

  markAsCompleted() {
    this.completed = !this.completed;
  }

  markAsImportant() {
    this.important = !this.important;
  }
}

const firstTask = new Task("Kill the world", "october 31 2025");
