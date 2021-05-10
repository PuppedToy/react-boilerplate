const battleManager = require('../../battle/battleManager');
const { TestBattle, Battle } = require('../../battle/battle');
const db = require('../../db');

async function createBattleGraphQL({ battleTemplateId, users }, { userToken }) {
  if (!userToken) throw new Error('User not authenticated');

  let battle;
  if (battleTemplateId === null) {
    battle = new TestBattle(users);
  } else {
    const { teams } = db.battles.getTemplate(battleTemplateId);
    // TODO put users in teams
    battle = new Battle(teams);
  }
  const battleId = await battle.init();
  battleManager.create(battle, userToken.id);

  return battleId;
}

module.exports = createBattleGraphQL;
