import { NewPage } from "./utils/newPage.js";
import { todoObj } from "./data/todo.js";
import { renderNewPageView } from "./todoDetail.js";

export function renderTodoHTML(array = todoObj.todos) {
  let html = "";
  array.forEach((todo) => {
    const today = dayjs();
    const dateString =
      todo.finishedAt.asNum.date === today.$D &&
      todo.finishedAt.asNum.month === today.$M + 1 &&
      todo.finishedAt.asNum.year === today.$y
        ? "Today"
        : todo.finishedAt.asString;

    const isChecked = todo.isCompleted ? "is-completed" : " ";
    html += `
    <div class="todo ${isChecked} ">
    <div class="check-box js-check-box" data-todo-id="${todo.id}"></div>
    <div class="todo-texts">
      <h3 class="info">${todo.todoTitle}</h3>
      <p class="info">${todo.todoDescription}</p>
      <p class="info">for: ${dateString}</p>
    </div>
    <div class="actions">
      <button data-todo-id="${todo.id}" class="delete-btn js-delete-btn">
        Delete
      </button>
      <button data-todo-id="${todo.id}" class="edit-btn js-view-btn">
        View
      </button>
    </div>
  </div>`;
  });

  document.querySelector(".js-todos").innerHTML = html;
  // delete
  document.querySelectorAll(".js-delete-btn").forEach((deleteLink) => {
    deleteLink.addEventListener("click", () => {
      const { todoId } = deleteLink.dataset;
      todoObj.removeTodos(todoId);
      renderTodoHTML();
      todoObj.displayCompletedRatio(
        document.querySelector(".js-ratio-display")
      );
    });
  });
  //complete
  document.querySelectorAll(".js-check-box").forEach((checkLink) => {
    checkLink.addEventListener("click", () => {
      const { todoId } = checkLink.dataset;
      todoObj.completeTodo(todoId);
      renderTodoHTML();
      todoObj.displayCompletedRatio(
        document.querySelector(".js-ratio-display")
      );
    });
  });
  // view
  document.querySelectorAll(".js-view-btn").forEach((view) => {
    view.addEventListener("click", () => {
      const { todoId } = view.dataset;
      renderNewPageView(todoId);
    });
  });
}
