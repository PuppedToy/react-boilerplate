/* eslint-disable no-param-reassign */
const moment = require('moment');
const shuffle = require('shuffle-array');

const db = require('../db');
const { hero1, hero2, testMonster } = require('../utils/data/characters');

class Battle {
  constructor(teams) {
    this.teams = teams;
    this.date = moment().format('MM-DD-YYYY');
    this.prepareCharacters();
  }

  async init() {
    const id = await db.battles.create(this.toObject());
    this.id = id;
  }

  userDraw(userId, amountCards = 1) {
    const character = this.getCharacterFromUser(userId);
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

    this.characterCheckEmtpyDeck();
    const card = character.deck.shift();
    if (card) {
      character.hand.push(card);
      this.characterCheckEmtpyDeck();
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

  getCharacterFromUser(userId) {
    for (let teamIndex = 0; teamIndex < this.teams.length; teamIndex += 1) {
      const { members } = this.teams[teamIndex];
      const member = members.find(({ user }) => user === userId);
      if (member) return member.character;
    }
    return null;
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
