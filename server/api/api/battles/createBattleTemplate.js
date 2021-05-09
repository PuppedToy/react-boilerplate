const db = require('../../db');

async function createBattleTemplateGraphQL(battle, { userToken }) {
  const battleId = await db.battles.createTemplate(battle, userToken.id);
  return battleId;
}

module.exports = createBattleTemplateGraphQL;
