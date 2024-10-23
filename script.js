// Hent elementer fra DOM
const todoForm = document.getElementById('todo-form')
const taskInput = document.getElementById('task-input')
const taskQuantity = document.getElementById('task-quantity')
const taskPriority = document.getElementById('task-priority')
const todoList = document.getElementById('todo-list')
const doneList = document.getElementById('done-list')

// Hent opgaver fra localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || []
let doneTasks = JSON.parse(localStorage.getItem('doneTasks')) || []

// Opdater UI med opgaver fra localStorage
window.onload = function () {
  displayTasks()
}

// Tilføj ny opgave
todoForm.addEventListener('submit', function (e) {
  e.preventDefault()

  const task = {
    id: Date.now(),
    text: taskInput.value,
    quantity: taskQuantity.value,
    priority: taskPriority.value, // Tilføj prioritet
    done: false
  }

  todos.push(task)
  saveAndRender()
  taskInput.value = ''
  taskQuantity.value = ''
})

// Funktion til at opdatere og gemme opgaver
function saveAndRender () {
  localStorage.setItem('todos', JSON.stringify(todos))
  localStorage.setItem('doneTasks', JSON.stringify(doneTasks))
  displayTasks()
}

// Funktion til at vise opgaver i listerne og sortere efter prioritet
function displayTasks () {
  todoList.innerHTML = ''
  doneList.innerHTML = ''

  // Sorter opgaver: High priority først
  const sortedTodos = todos.sort((a, b) =>
    a.priority === 'high' && b.priority === 'low' ? -1 : 1
  )

  sortedTodos.forEach(task => {
    const li = document.createElement('li')
    li.classList.add(task.priority) // Tilføj klasse baseret på prioritet
    li.innerHTML = `${task.text} (${task.quantity}) - <strong>${task.priority}</strong> 
        <button onclick="markAsDone(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>`
    todoList.appendChild(li)
  })

  doneTasks.forEach(task => {
    const li = document.createElement('li')
    li.classList.add('done')
    li.innerHTML = `${task.text} (${task.quantity}) - <strong>${task.priority}</strong>
        <button onclick="undoTask(${task.id})">↩</button>
        <button onclick="deleteDoneTask(${task.id})">🗑</button>`
    doneList.appendChild(li)
  })
}

// Markér som færdig
function markAsDone (id) {
  const taskIndex = todos.findIndex(task => task.id === id)
  const task = todos.splice(taskIndex, 1)[0]
  task.done = true
  doneTasks.push(task)
  saveAndRender()
}

// Fortryd færdiggørelse
function undoTask (id) {
  const taskIndex = doneTasks.findIndex(task => task.id === id)
  const task = doneTasks.splice(taskIndex, 1)[0]
  task.done = false
  todos.push(task)
  saveAndRender()
}

// Slet opgave
function deleteTask (id) {
  todos = todos.filter(task => task.id !== id)
  saveAndRender()
}

// Slet færdig opgave
function deleteDoneTask (id) {
  doneTasks = doneTasks.filter(task => task.id !== id)
  saveAndRender()
}
