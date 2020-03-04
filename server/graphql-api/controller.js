function ping() {
  return 'ping';
}

let idCounter = 1;
let todoList = [];

function addTodo({ title }) {
  const newItem = { title, id: idCounter, done: false };
  todoList.push(newItem);
  idCounter += 1;
  return newItem;
}

function getTodoList() {
  return todoList;
}

function reset() {
  idCounter = 1;
  todoList = [];
}

const controller = {
  ping,
  addTodo,
  getTodoList,
  reset,
};

module.exports = controller;
