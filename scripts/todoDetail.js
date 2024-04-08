import { todoObj } from "./data/todo.js";
import { renderTodoHTML } from "./todoHTML.js";
import { updateTodo } from "./updateTodo.js";
import { NewPage } from "./utils/newPage.js";

const page = new NewPage();

export function renderNewPageView(todoId) {
  const todo = todoObj.getTodo(todoId);
  const isChecked = todo.isCompleted ? "is-completed-2" : "";
  const today = dayjs();
  const dateString =
    todo.finishedAt.asNum.date === today.$D &&
    todo.finishedAt.asNum.month === today.$M + 1 &&
    todo.finishedAt.asNum.year === today.$y
      ? "Today"
      : todo.finishedAt.asString;
  const html = `
    <div class="container-lg view-container">
      <div class="view-header">
        <div class="arrow js-arrow"><img src="./icons/arrow.png" alt="arrow" /></div>
        <div class="title"><p>Task Details</p></div>
      </div>
      <div class="view-infos">
        <h2>${todo.todoTitle}</h2>
        <p>
         ${todo.todoDescription}
        </p>
        <div class="view-date">
          <p>created At: ${todo.createdAt}</p>
          <p>for: ${dateString}</p>
        </div>
        <div class="view-actions">
          <button class="complete-btn btn js-complete-btn" 
          data-todo-id="${todo.id}">
            <div class="check-box ${isChecked}"></div>
            <span>${todo.isCompleted ? "Completed" : "Complete"}</span>
          </button>
          <button class="delete-btn btn js-delete-btn-view" 
          data-todo-id="${todo.id}">
            <img src="./icons/delete.png" />
            <span>Delete</span>
          </button>
          <button class="update-btn btn js-update-btn" data-todo-id="${
            todo.id
          }">
            <img src="./icons/edit.png" />
            <span>Update</span>
            </button>
            </div>
            </div>
            </div> `;
  page.render(html);
  page.open();
  // complete
  document.querySelectorAll(".js-complete-btn").forEach((completeBtn) => {
    completeBtn.addEventListener("click", () => {
      const { todoId } = completeBtn.dataset;
      todoObj.completeTodo(todoId);
      renderTodoHTML();
      renderNewPageView(todoId);
      todoObj.displayCompletedRatio(
        document.querySelector(".js-ratio-display")
      );
    });
  });
  // close page
  document.querySelector(".js-arrow").addEventListener("click", () => {
    page.close();
  });
  // delete
  document.querySelectorAll(".js-delete-btn-view").forEach((deleteLink) => {
    deleteLink.addEventListener("click", () => {
      const { todoId } = deleteLink.dataset;
      todoObj.removeTodos(todoId);
      renderTodoHTML();
      page.close();
      todoObj.displayCompletedRatio(
        document.querySelector(".js-ratio-display")
      );
    });
  });
  // update
  document.querySelectorAll(".js-update-btn").forEach((updateLink) => {
    updateLink.addEventListener("click", () => {
      const { todoId } = updateLink.dataset;
      page.close();
      updateTodo(todoId);
    });
  });
}
