function ping() {
  return 'ping';
}

function addTodo({ title }) {
  return { title };
}

const controller = {
  ping,
  addTodo,
};

module.exports = controller;
