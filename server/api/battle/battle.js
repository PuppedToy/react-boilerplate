/* eslint-disable no-param-reassign */
const moment = require('moment');
const shuffle = require('shuffle-array');

const db = require('../db');
const { hero1, hero2, testMonster } = require('../utils/data/characters');
const { USER_BATTLE_STATES } = require('../enums');

class Battle {
  constructor(teams) {
    this.teams = teams;
    this.date = moment().format('MM-DD-YYYY');
    this.prepareCharacters();
    this.users = {};
    this.teams.forEach(team => {
      team.members
        .filter(({ user }) => user !== 'bot')
        .forEach(member => {
          if (!Object.hasOwnProperty.call(this.users, member.user)) {
            this.users[member.user] = {
              state: USER_BATTLE_STATES.DISCONNECTED,
            };
          }
        });
    });
  }

  async init() {
    const id = await db.battles.create(this.toObject());
    this.id = String(id);
    return this.id;
  }

  userDraw(userId, characterIndex, amountCards = 1) {
    const characters = this.getCharactersFromUser(userId);
    const character = characters[characterIndex];
    if (!character) throw new Error(`Character from user ${userId} not found`);

    this.characterDraw(character, amountCards);
  }

  characterShuffle(character) {
    shuffle(character.deck);
  }

  characterCheckEmtpyDeck(character) {
    if (character.deck.length === 0) {
      character.deck = [...character.discardPile];
      character.discardPile = [];
      this.characterShuffle(character);
    }
  }

  characterDraw(character, amountCards = 1) {
    if (!amountCards || amountCards < 1) return;
    if (amountCards > 1) {
      for (let currentCard = 0; currentCard < amountCards; currentCard += 1) {
        this.characterDraw(character);
      }
    }

    this.characterCheckEmtpyDeck(character);
    const card = character.deck.shift();
    if (card) {
      character.hand.push(card);
      this.characterCheckEmtpyDeck(character);
    }
    // Else there are no cards either in discard pile nor deck. Draw is impossible
  }

  prepareCharacters() {
    this.teams.forEach(team => {
      if (!team.members)
        throw new Error(
          `Team does not have members. Team: ${JSON.stringify(team)}`,
        );
      team.members.forEach(member => {
        const { character } = member;
        if (!character)
          throw new Error(
            `Member does not have a character. Member: ${JSON.stringify(
              member,
            )}`,
          );
        character.hp = character.attributes.maxHp;
        if (character.type === 'hero') {
          character.hand = [];
          character.discardPile = [];
          character.banishedPile = [];
          this.characterShuffle(character);
          this.characterDraw(character, character.attributes.cardsInHand);
        }
      });
    });
  }

  getAssets() {
    const prefix = '/api/public/images/';
    const assets = ['cardoutline.png'];
    this.teams.forEach(team => {
      team.members.forEach(member => {
        if (
          member.character.picture &&
          !assets.includes(member.character.picture)
        ) {
          assets.push(member.character.picture);
        }
        if (member.character.deck) {
          member.character.deck.forEach(card => {
            if (card.picture && !assets.includes(card.picture)) {
              assets.push(card.picture);
            }
          });
        }
      });
    });
    return assets.map(asset => `${prefix}${asset}`);
  }

  getCharactersFromUser(userId) {
    for (let teamIndex = 0; teamIndex < this.teams.length; teamIndex += 1) {
      const { members } = this.teams[teamIndex];
      const member = members.find(({ user }) => user === userId);
      if (member) return member.character;
    }
    return null;
  }

  getBattleStatus(userId) {
    const playerCharacters = this.getCharactersFromUser(userId);
    const { id, teams, users } = this;
    return {
      id,
      userId,
      teams,
      users,
      playerCharacters,
    };
  }

  isEveryoneConnected() {
    return Object.values(this.users).every(
      ({ state }) =>
        state === USER_BATTLE_STATES.ONLINE ||
        state === USER_BATTLE_STATES.SLOW_CONNECTION,
    );
  }

  setUserState(userId, state) {
    if (!Object.hasOwnProperty.call(this.users, userId)) {
      throw new Error(`User ${userId} does not exist on this battle`);
    }
    this.users[userId].state = state;
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
            character: { ...hero1, team: 0 },
          },
          {
            user: user2,
            character: { ...hero2, team: 0 },
          },
        ],
      },
      {
        id: 1,
        members: [
          {
            user: 'bot',
            character: { ...testMonster, team: 1 },
          },
          {
            user: 'bot',
            character: { ...testMonster, team: 1 },
          },
        ],
      },
    ];
    super(teams);
  }
}

module.exports = { Battle, TestBattle };
