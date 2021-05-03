const { getDatabase } = require('../utils/getDatabase');

async function create(battle) {
  const db = await getDatabase('battles');

  const result = await db.insertOne(battle);

  return result.insertedId.toString();
}
module.exports.create = create;
