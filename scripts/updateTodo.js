import notification from "./utils/alert.js";
import { todoObj } from "./data/todo.js";
import { renderTodoHTML } from "./todoHTML.js";

export function updateTodo(todoId) {
  const todo = todoObj.getTodo(todoId);
  const container = document.querySelector(".js-update-section");
  container.classList.add("open");
  const html = `
  <div class="container-sm form-box">
    <h2>Update your Task</h2>
    <form class="js-task-form-update">
      <input type="text" name="todoTitle" class="js-todo-title" placeholder="Title" value="${todo.todoTitle}"/>
      <textarea name="todoDescription"  class="js-todo-description" placeholder="Descriptioin" >${todo.todoDescription}</textarea>
      <div>
      <input type="checkbox" id="ch" class="js-check"/>
      <label for="ch">Leave date as it was.</label>
      </div>
      <div class="for">
        <span>for:</span>
        <input type="number" class="js-todo-number" name="date" placeholder="numbers"  />
        <select name="type" class="js-todo-type">
        <option value="days">days</option>
        <option value="months">months</option>
        <option value="years">years</option>
        </select>
      </div>
      <div class="buttons">
      <button class="btn js-update-button" type="submit">Update</button>
      <button class="btn js-task-cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
  `;

  container.innerHTML = html;
  document
    .querySelector(".js-task-form-update")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });
  // cancel form
  document
    .querySelector(".js-task-cancel-btn")
    .addEventListener("click", () => container.classList.remove("open"));
  // update form
  document.querySelector(".js-update-button").addEventListener("click", () => {
    const titleEl = document.querySelector(".js-todo-title");
    const descriptionEl = document.querySelector(".js-todo-description");
    const numberEl = document.querySelector(".js-todo-number");
    const typeEl = document.querySelector(".js-todo-type");
    const checkEl = document.querySelector(".js-check");

    if (
      !titleEl.value ||
      !descriptionEl.value ||
      ((+numberEl.value < 0 || !numberEl.value) && !checkEl.checked) ||
      (checkEl.checked && (numberEl.value || +numberEl.value > 0))
    ) {
      let stringErrorMsg = "";
      let verb = 0;
      if (!titleEl.value) {
        stringErrorMsg += " title ";
        verb++;
      }
      if (!descriptionEl.value) {
        stringErrorMsg += " description ";
        verb++;
      }

      if ((!numberEl.value || +numberEl.value < 0) && !checkEl.checked) {
        stringErrorMsg += " either update the date or click checkbox ";
        verb++;
      }
      if ((numberEl.value || +numberEl.value > 0) && checkEl.checked) {
        stringErrorMsg += " You can't choose both date and checkbox ";
        verb++;
      }
      let timeout;
      notification(
        ` ${stringErrorMsg} ${verb > 1 ? "are" : "is"} required.`,
        timeout
      );
    } else {
      const today = dayjs();
      let stringDate;
      let date, month, year;
      if (!checkEl.checked) {
        const addedDate = today.add(+numberEl.value, typeEl.value);
        stringDate =
          addedDate.format(`dddd - MMMM`) +
          `(${addedDate.$M + 1})` +
          addedDate.format(` - YYYY`);
        date = addedDate.$D;
        month = addedDate.$M + 1;
        year = addedDate.$y;
      } else if (checkEl.checked) {
        stringDate = todo.finishedAt.asString;
        date = todo.finishedAt.asNum.date;
        month = todo.finishedAt.asNum.month;
        year = todo.finishedAt.asNum.year;
      }

      const data = {
        todoTitle: titleEl.value.trim(),
        todoDescription: descriptionEl.value.trim(),
        isCompleted: todo.isCompleted,
        createdAt: todo.createdAt,
        finishedAt: {
          asString: stringDate,
          asNum: {
            date,
            month,
            year,
          },
        },
      };
      todoObj.updateTodos(todoId, data);
      renderTodoHTML();
      container.classList.remove("open");
    }
  });
}
