/* eslint-disable no-unused-vars */

function arrayShuffle(array) {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, got ${typeof array}`);
  }

  // eslint-disable-next-line no-param-reassign
  array = [...array];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    // eslint-disable-next-line no-param-reassign
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }

  return array;
}
