const tasks = JSON.parse(localStorage.getItem('tasks')) || [];


// dom
const addTaskBtnOpen = document.querySelector('.js-add-task-btn');
const addTaskPage = document.querySelector('.js-add-task-page');
const taskPageCancelBtn = document.querySelector('.js-task-page-cancel-btn');
const taskPageSaveBtn = document.querySelector('.js-task-page-save-btn');
const titleEl = document.getElementById('title');
const descriptionEl = document.getElementById('description');
const dateEl = document.getElementById('date');
const catagoryContanerEl = document.querySelector('.js-catagorys');
const taskContanerEl = document.querySelector('.js-tasks');
const headerText = document.querySelector('.js-header');
const tabs = catagoryContanerEl.querySelectorAll('.tab');
const taskRatioDisplay = document.querySelector('.js-task-display');
const tabsEl = document.querySelector('.js-tabs');
let taskLeng = tasks.length;
let catagory;
let isNewTask = false;


// new task page
addTaskBtnOpen.addEventListener('click', () => {
  addTaskPage.classList.add('new-task');
  taskPageSaveBtn.textContent = 'Save';
  titleEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
  headerText.textContent = 'New Task';
  isNewTask = true;
})
taskPageCancelBtn.addEventListener('click', () => {
  addTaskPage.classList.remove('new-task');
  clearInputs();
  isNewTask = false;

})

function task() {
  let title;
  let description;
  let date;

  catagoryContanerEl.addEventListener('click', (e) => {
    catagory = e.target.closest('.tab');
    if (!catagory) return;
    clearCatagoryActive();
    catagory.classList.add('active');
    catagory = catagory.textContent;

  })

  taskPageSaveBtn.addEventListener('click', () => {
    if (isNewTask) {
      title = titleEl.value;
      description = descriptionEl.value;
      date = dateEl.value;
      if (!titleEl.value) {
        titleEl.style.borderColor = 'red';
        return
      } else {
        titleEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
      }
      if (!descriptionEl.value) {
        descriptionEl.style.borderColor = 'red';
        return
      } else {
        descriptionEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
      }
      if (!dateEl.value) {
        dateEl.style.borderColor = 'red';
        return
      } else {
        dateEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
      }
      if (!catagory) {
        catagoryContanerEl.style.borderColor = 'red';
        return
      } else {
        catagoryContanerEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
      }

      tasks.push({
        id: tasks.length,
        title,
        description,
        date,
        catagory,
        isComplete: false
      })

      saveTasks(tasks);
      clearInputs();
      renderTasks(tasks);
      taskDisplay();
      addTaskPage.classList.remove('new-task');
      isNewTask = false;
    }
  });
}
function clearInputs() {
  titleEl.value = '';
  descriptionEl.value = '';
  dateEl.value = '';
  clearCatagoryActive();
  titleEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
  descriptionEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
  dateEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
  catagoryContanerEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
  catagory = '';
}

function clearCatagoryActive() {
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
}

function saveTasks(task) {
  localStorage.setItem('tasks', JSON.stringify(task));
}
task();


// render tasks
function renderTasks(task, tabValue) {
  if (task.length <= 0) {
    tabValue === 'Today' ? taskContanerEl.innerHTML = '<h1>You don\'t have tasks today...</h1>' : taskContanerEl.innerHTML = '<h1>You don\'t have tasks here...</h1>';
    taskContanerEl.classList.add('empty-result');
    return;
  }
  let taskHtml = '';
  task.forEach(taskInfo => {
    taskHtml += `
    <div class="task ${taskInfo.isComplete && 'completed'}">
      <img class="catagory-icon" src="../icons/${taskInfo.catagory}.png" > 
      <h1 class="task-title">${taskInfo.title}</h1>
      <p class="task-disc">${taskInfo.description}</p>
      <p class="task-date">${taskInfo.date}</p>
      <div class="task-btns">
        <button class="btn btn-orange ${taskInfo.isComplete ? 'is-complete-color' : ''}  js-complete-btn">${taskInfo.isComplete ? 'Completed' : 'Complete'}</button>
        <button class="btn btn-blue js-edit-btn">Edit</button>
        <button class="btn btn-red js-delete-btn">Delete</button>
      </div>
    </div>
    `;
  })
  taskContanerEl.classList.remove('empty-result');
  taskContanerEl.innerHTML = taskHtml;

  // complete
  document.querySelectorAll('.js-complete-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const changeTask = task[i].isComplete ? false : true;
      task[i].isComplete = changeTask;
      saveTasks(tasks);
      renderTasks(task);
      taskDisplay();
    })
  })

  // delete
  document.querySelectorAll('.js-delete-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (task.length < tasks.length) {
        tasks.forEach((ts, j) => {
          if (task[i].id === ts.id) {
            tasks.splice(j, 1);
          }
        })
        saveTasks(tasks);
        taskDisplay();
        const filteredTasks = tasks.filter(task => {
          if (tabValue === 'All') {
            return true;
          } else if (tabValue == task.catagory) {
            return true;
          }
          else {
            return false;
          }
        });
        renderTasks(filteredTasks, tabValue);
      } else {
        tasks.splice(i, 1);
        saveTasks(tasks);
        taskDisplay();
        renderTasks(tasks)
      }
    })
  });

  // update
  document.querySelectorAll('.js-edit-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (!isNewTask) {
        addTaskPage.classList.add('new-task');
        taskPageSaveBtn.textContent = 'Update';
        headerText.textContent = 'Edit Your Task';
        titleEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';

        const updateTask = tasks[i];
        titleEl.value = updateTask.title;
        descriptionEl.value = updateTask.description;
        dateEl.value = updateTask.date;
        catagory = updateTask.catagory;
        tabs.forEach((tab, i) => {
          if (tab.innerText === updateTask.catagory) {
            tab.classList.add('active');
          }
        })


        taskPageSaveBtn.addEventListener('click', () => {
          let title = titleEl.value;
          let description = descriptionEl.value;
          let date = dateEl.value;

          if (!titleEl.value) {
            titleEl.style.borderColor = 'red';
            return
          } else {
            titleEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
          }
          if (!descriptionEl.value) {
            descriptionEl.style.borderColor = 'red';
            return
          } else {
            descriptionEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
          }
          if (!dateEl.value) {
            dateEl.style.borderColor = 'red';
            return
          } else {
            dateEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
          }
          if (!catagory) {
            catagoryContanerEl.style.borderColor = 'red';
            return
          } else {
            catagoryContanerEl.style.borderColor = 'rgba(0, 76, 255, 0.72)';
          }
          tasks[i].title = title;
          tasks[i].description = description;
          tasks[i].date = date;
          tasks[i].catagory = catagory;
          saveTasks(tasks);
          clearInputs();
          renderTasks(tasks);
          addTaskPage.classList.remove('new-task');
          isNewTask = false;
        });
      }
    })
  })

}
renderTasks(tasks);


// task display in ratio how many complete task
function taskDisplay() {
  taskLeng = tasks.length;
  const taskComplete = tasks.filter(task => {
    return task.isComplete;
  })
  taskRatioDisplay.textContent = `${taskComplete.length}/${taskLeng} Completed`;
}
taskDisplay();


// filter
tabsEl.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  const today = `${new Date().getFullYear()}-${new Date().getMonth() < 10 ? '0' + new Date().getMonth() : new Date().getMonth()}-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`;
  if (!tab) return;
  tabsEl.querySelectorAll('.tab').forEach(tb => tb.classList.remove('active'));
  tab.classList.add('active');
  const tabValue = tab.textContent;
  const filteredTasks = tasks.filter(task => {
    if (tabValue === 'All') {
      return true;
    } else if (tabValue == task.catagory) {
      return true;
    } else if (tabValue == 'Today') {
      return task.date == today;

    }
    else {
      return false;
    }
  });
  renderTasks(filteredTasks, tabValue);

})
