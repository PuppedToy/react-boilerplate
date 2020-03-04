function ping() {
  return 'ping';
}

let idCounter = 1;

function addTodo({ title }) {
  const newItem = { title, id: idCounter };
  idCounter += 1;
  return newItem;
}

function getTodo() {}

function reset() {
  idCounter = 1;
}

const controller = {
  ping,
  addTodo,
  getTodo,
  reset,
};

module.exports = controller;
