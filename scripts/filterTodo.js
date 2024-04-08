import { todoObj } from "./data/todo.js";
import { renderTodoHTML } from "./todoHTML.js";

export function navigateWithTab() {
  const links = document.querySelectorAll(".js-links");
  let searchTerm = "All";
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      searchTerm = e.target.innerText;
      removeActiveLinks();
      e.target.classList.add("active");
      renderTodoHTML(todoObj.filterTodos(searchTerm), true);
    });
  });

  function removeActiveLinks() {
    document
      .querySelectorAll(".js-tab")
      .forEach((tab) => tab.classList.remove("active"));
  }
}
