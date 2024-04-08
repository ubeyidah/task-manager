export class NewPage {
  render(html) {
    document.querySelector(
      ".js-new-page-container"
    ).innerHTML = `<div class="js-new-page new-page">${html}</div>`;
  }
  close() {
    document.querySelector(".js-new-page").remove();
  }
  open() {
    document.querySelector(".js-new-page").classList.add("open");
  }
}
