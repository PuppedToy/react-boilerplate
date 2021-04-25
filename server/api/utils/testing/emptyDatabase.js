const { getDatabase } = require('../getDatabase');

function emptyDatabase() {
  return getDatabase().then(db => db.dropDatabase());
}

module.exports = emptyDatabase;
