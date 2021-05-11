const battleManager = require('../../battle/battleManager');
const { TestBattle, Battle } = require('../../battle/battle');
const db = require('../../db');
const { sendMessage } = require('../../utils/socket');
const { SOCKET_TYPES } = require('../../enums');

async function createBattleGraphQL({ battleTemplateId, users }, { userToken }) {
  if (!userToken) throw new Error('User not authenticated');

  let battle;
  if (!battleTemplateId) {
    battle = new TestBattle(users);
  } else {
    const { teams } = db.battles.getTemplate(battleTemplateId);
    // TODO put users in teams
    battle = new Battle(teams);
  }

  const battleId = await battle.init();
  battleManager.create(battle, userToken.id);
  sendMessage(users, SOCKET_TYPES.DASHBOARD, 'battle-start', {
    battleId,
  });

  return battleId;
}

module.exports = createBattleGraphQL;
