const db = require('../db');
const { USER_BATTLE_STATES } = require('../enums');

class BattleManager {
  constructor() {
    this.battles = {};
  }

  async create(battle, creatorId) {
    const battleId = await db.battles.create(battle);
    this.battles[battleId] = {
      originalState: { ...battle },
      id: battleId,
      creatorId,
      sockets: {},
    };
  }

  getBattle(battleId) {
    if (!battleId || !Object.hasOwnProperty.call(this.battles, battleId)) {
      throw new Error(`Battle ${battleId} not found`);
    }
    return this.battles[battleId];
  }

  connect(battleId, userId, socket) {
    const battle = this.getBattle(battleId);
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (Object.hasOwnProperty.call(battle.sockets, userId)) {
      battle.sockets[userId].emit('disconnect');
      delete battle.sockets[userId];
    }

    battle.sockets[userId] = this.createSocketHandlers(
      socket,
      battleId,
      userId,
    );

    battle.setUserState(userId, USER_BATTLE_STATES.ONLINE);
    console.log(`Player ${userId} connected to battle ${battleId}`);
    if (battle.isEveryoneConnected()) {
      const payload = {
        teams: battle.teams,
        player: receiverUserId => battle.getCharactersFromUser(receiverUserId),
      };
      this.broadcastBattle(battleId, 'battle-start', payload);
    }
  }

  createSocketHandlers(socket, battleId, userId) {
    socket.on('battle-status', () => {
      const battle = this.getBattle(battleId);
      const battleStatus = battle.getBattleStatus(userId);
      socket.emit('battle-status-response', battleStatus);
    });

    return socket;
  }

  broadcastBattle(battleId, message, rawPayload) {
    if (!message || typeof message !== 'string') {
      throw new Error(
        `Expected type of message string but found "${typeof message}"`,
      );
    }

    const battle = this.getBattle(battleId);

    const payloadFunctionKeys = Object.entries(rawPayload)
      .filter(entry => typeof entry[1] === 'function')
      .map(([key]) => key);

    Object.entries(battle.sockets).forEach(([userId, socket]) => {
      const payload = { ...rawPayload };
      payloadFunctionKeys.forEach(key => {
        payload[key] = payload[key](userId);
      });
      socket.emit(message, payload);
    });
  }
}

const battleManager = new BattleManager();

module.exports = battleManager;
