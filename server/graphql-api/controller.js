function ping() {
  return 'ping';
}

function addTodo({ title }) {
  return { title, id: 1 };
}

const controller = {
  ping,
  addTodo,
};

module.exports = controller;
