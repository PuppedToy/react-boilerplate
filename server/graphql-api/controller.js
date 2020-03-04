function ping() {
  return 'ping';
}

let idCounter = 1;

function addTodo({ title }) {
  const newItem = { title, id: idCounter };
  idCounter += 1;
  return newItem;
}

const controller = {
  ping,
  addTodo,
};

module.exports = controller;
