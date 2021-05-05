const db = require('../db');

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
  }

  createSocketHandlers(socket, battleId, userId) {
    // TODO socket.on...
    socket.on('ping', () => {
      socket.emit('ping', { battleId, userId });
    });

    return socket;
  }

  broadcastBattle(battleId, message, payload) {
    if (!message || typeof message !== 'string') {
      throw new Error(
        `Expected type of message string but found "${typeof message}"`,
      );
    }

    const battle = this.getBattle(battleId);

    Object.values(battle.sockets).forEach(socket => {
      socket.emit(message, payload);
    });
  }
}

const battleManager = new BattleManager();

module.exports = battleManager;
