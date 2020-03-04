function ping() {
  return 'ping';
}

let idCounter = 1;

function addTodo({ title }) {
  const newItem = { title, id: idCounter };
  idCounter += 1;
  return newItem;
}

function getTodoList() {}

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
