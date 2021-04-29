const db = require('../../db');

// TODO return creation result instead of true or false
async function createBattleGraphQL(_, { userToken }) {
  if (!userToken) throw new Error('User not authenticated');

  const campaign = await db.campaigns.create(userToken);
  return campaign;
}

module.exports = createBattleGraphQL;
