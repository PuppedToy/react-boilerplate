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
  return todoList.slice();
}

function toggleTodo({ id }) {
  const foundItem = todoList.find(
    item => Object.hasOwnProperty.call(item, 'id') && item.id === id,
  );
  if (!foundItem) throw new Error(`Item ${id} does not exist`);
  foundItem.done = !foundItem.done;
  return { ...foundItem };
}

function reset() {
  idCounter = 1;
  todoList = [];
}

const controller = {
  ping,
  addTodo,
  toggleTodo,
  getTodoList,
  reset,
};

module.exports = controller;
