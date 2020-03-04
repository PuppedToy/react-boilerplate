function ping() {
  return 'ping';
}

let idCounter = 1;

function addTodo({ title }) {
  const newItem = { title, id: idCounter, done: false };
  idCounter += 1;
  return newItem;
}

function getTodoList() {
  return [];
}

function reset() {
  idCounter = 1;
}

const controller = {
  ping,
  addTodo,
  getTodoList,
  reset,
};

module.exports = controller;
