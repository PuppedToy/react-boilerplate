const moment = require('moment');
const db = require('../db');
const { hero1, hero2, testMonster } = require('./data/characters');

class Battle {
  constructor(teams) {
    this.teams = teams;
    this.date = moment().format('MM-DD-YYYY');
  }

  async init() {
    const id = await db.battles.create(this.toObject());
    this.id = id;
  }

  toObject() {
    return {
      teams: this.teams,
      date: this.date,
    };
  }
}

class TestBattle extends Battle {
  constructor([user1, user2]) {
    const teams = [
      {
        id: 0,
        members: [
          {
            user: user1,
            type: 'hero',
            character: { ...hero1, team: 0 },
          },
          {
            user: user2,
            type: 'hero',
            character: { ...hero2, team: 0 },
          },
        ],
      },
      {
        id: 1,
        members: [
          {
            user: 'bot',
            type: 'minion',
            character: { ...testMonster, team: 1 },
          },
          {
            user: 'bot',
            type: 'minion',
            character: { ...testMonster, team: 1 },
          },
        ],
      },
    ];
    super(teams);
  }

  async init() {
    await super.init();
  }
}

module.exports = { Battle, TestBattle };
