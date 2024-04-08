import notification from "../utils/alert";

class Todo {
  todos;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  // load todos from localStorage
  loadFromStorage() {
    this.todos = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }

  // save todos
  saveTodoInStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.todos));
  }

  // create new todo
  addNewTodo(data) {
    let isThereMatch = false;
    this.todos.forEach((todo) => {
      if (
        todo.todoTitle === data.todoTitle &&
        todo.todoDescription === data.todoDescription &&
        todo.createdAt === data.createdAt &&
        todo.finishedAt.after === data.finishedAt.after &&
        todo.finishedAt.type === data.finishedAt.type
      ) {
        isThereMatch = true;
      }
    });

    if (!isThereMatch) {
      this.todos.unshift({ ...data, id: crypto.randomUUID() });
      this.saveTodoInStorage();
      let timeout;
      notification("Created.", timeout, true);
    } else {
      let timeout;
      notification("This todo is alrady created!", timeout);
    }
  }

  // update todos
  updateTodos(todoId, data) {
    this.todos.forEach((todo) => {
      if (todo.id === todoId) {
        todo.todoTitle = data.todoTitle;
        todo.todoDescription = data.todoDescription;
        todo.isCompleted = data.isCompleted;
        todo.createdAt = data.createdAt;
        todo.finishedAt = data.finishedAt;
      }
    });
    this.saveTodoInStorage();
  }

  // complete todo
  completeTodo(todoId) {
    this.todos.forEach((todo) => {
      if (todoId === todo.id) {
        todo.isCompleted = todo.isCompleted ? false : true;
      }
    });
    this.saveTodoInStorage();
  }

  // delete todos
  removeTodos(todoId) {
    const filteredTodos = this.todos.filter((todo) => todoId !== todo.id);
    this.todos = filteredTodos;
    this.saveTodoInStorage();
  }

  // display how many completed in the todos
  displayCompletedRatio(element) {
    let completed = 0;
    this.todos.forEach((todo) => {
      if (todo.isCompleted) {
        completed++;
      }
    });
    element.textContent = `${completed}/${this.todos.length}`;
  }
  // filter
  filterTodos(searchTerm) {
    let fillteredTodos;
    if (searchTerm === "All") {
      fillteredTodos = this.todos;
    } else if (searchTerm === "Completed") {
      fillteredTodos = this.todos.filter((todo) => todo.isCompleted);
    } else if (searchTerm === "Active") {
      fillteredTodos = this.todos.filter((todo) => !todo.isCompleted);
    } else if (searchTerm === "Todays") {
      const today = dayjs();
      fillteredTodos = this.todos.filter((todo) => {
        if (
          todo.finishedAt.asNum.date === today.$D &&
          todo.finishedAt.asNum.month === today.$M + 1 &&
          todo.finishedAt.asNum.year === today.$y
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    return fillteredTodos;
  }

  //get todo
  getTodo(todoId) {
    let machingTodo;
    this.todos.forEach((todo) => {
      if (todoId === todo.id) {
        machingTodo = todo;
      }
    });
    return machingTodo;
  }
}

export const todoObj = new Todo("todos");
