import { NewPage } from "./utils/newPage.js";
import { todoObj } from "./data/todo.js";
import notification from "./utils/alert.js";
import { renderTodoHTML } from "./todoHTML.js";

const newPage = new NewPage();
export function createNewTodo() {
  const addTodoBtn = document.querySelector(".js-add-task-btn");
  addTodoBtn.addEventListener("click", () => {
    const html = `
  <div class="container-sm form-box">
    <h2>Add New Task</h2>
    <form class="js-new-task-form">
      <input type="text" name="todoTitle" class="js-todo-title" placeholder="Title" />
      <textarea name="todoDescription"  class="js-todo-description" placeholder="Descriptioin"></textarea>
      <div class="for">
        <span>for:</span>
        <input type="number" class="js-todo-number" name="date" placeholder="numbers" />
        <select name="type" class="js-todo-type">
        <option value="days">days</option>
        <option value="months">months</option>
        <option value="years">years</option>
        </select>
      </div>
      <div class="buttons">
      <button class="btn" type="submit">Add Todo</button>
      <button class="btn js-new-cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
  `;
    newPage.render(html);
    newPage.open();
    document
      .querySelector(".js-new-cancel-btn")
      .addEventListener("click", () => {
        newPage.close();
      });
    document
      .querySelector(".js-new-task-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const titleEl = document.querySelector(".js-todo-title");
        const descriptionEl = document.querySelector(".js-todo-description");
        const numberEl = document.querySelector(".js-todo-number");
        const typeEl = document.querySelector(".js-todo-type");

        if (
          !titleEl.value ||
          !descriptionEl.value ||
          !numberEl.value ||
          +numberEl.value < 0
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
          if (!numberEl.value || +numberEl.value < 0) {
            stringErrorMsg += " time ";
            verb++;
          }

          let timeout;
          notification(
            ` ${stringErrorMsg} ${verb > 1 ? "are" : "is"} required.`,
            timeout
          );
        } else {
          const today = dayjs();
          const addedDate = today.add(+numberEl.value, typeEl.value);
          const stringDate =
            addedDate.format(`dddd - MMMM`) +
            `(${addedDate.$M + 1})` +
            addedDate.format(` - YYYY`);
          const data = {
            todoTitle: titleEl.value.trim(),
            todoDescription: descriptionEl.value.trim(),
            isCompleted: false,
            createdAt: `${today.$D}/${today.$M + 1}/${today.$y}`,
            finishedAt: {
              asString: stringDate,
              asNum: {
                date: addedDate.$D,
                month: addedDate.$M + 1,
                year: addedDate.$y,
              },
            },
          };
          todoObj.addNewTodo(data);
          renderTodoHTML();
          todoObj.displayCompletedRatio(
            document.querySelector(".js-ratio-display")
          );
          newPage.close();
        }
      });
  });
  todoObj.displayCompletedRatio(document.querySelector(".js-ratio-display"));
}
