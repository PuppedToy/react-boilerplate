const battleManager = require('../../battle/battleManager');

// TODO return creation result instead of true or false
async function createBattleGraphQL(battle, { userToken }) {
  if (!userToken) throw new Error('User not authenticated');

  const battleId = battleManager.create(battle, userToken.id);
  // const battle = await db.battles.create(userToken);
  // return battle;
  return battleId;
}

module.exports = createBattleGraphQL;
