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

function findItem(id) {
  const foundIndex = todoList.findIndex(
    item => Object.hasOwnProperty.call(item, 'id') && item.id === id,
  );
  if (foundIndex < 0) throw new Error(`Item ${id} does not exist`);
  const foundItem = todoList[foundIndex];
  return { foundItem, foundIndex };
}

function toggleTodo({ id }) {
  const { foundItem } = findItem(id);
  foundItem.done = !foundItem.done;
  return { ...foundItem };
}

function deleteTodo({ id }) {
  const { foundItem, foundIndex } = findItem(id);
  todoList.splice(foundIndex, 1);
  return { ...foundItem };
}

function editTodo({ id, title }) {
  const { foundItem } = findItem(id);
  foundItem.title = title;
  return { ...foundItem };
}

function reset() {
  idCounter = 1;
  todoList = [];
  return true;
}

const controller = {
  ping,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  getTodoList,
  reset,
};

module.exports = controller;
