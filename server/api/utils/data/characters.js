const basicAttackCard = {
  id: 0,
  name: 'Basic Attack',
  cost: 1,
  effects: [
    {
      type: 'damage',
      target: 'basic',
      args: [4],
    },
  ],
};

const basicDefenseCard = {
  id: 1,
  name: 'Basic Defense',
  cost: 1,
  effects: [
    {
      type: 'addArmor',
      target: 'self',
      args: [4],
    },
  ],
};

const basicDeck = [
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicAttackCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
  basicDefenseCard,
];

const hero1 = {
  id: 0,
  name: 'Jorge Watkins',
  race: {
    id: 0,
    name: 'human',
  },
  alignment: 'NEUTRAL_GOOD',
  fields: [],
  level: 1,
  exp: 0,
  attributes: {
    strength: 12,
    dexterity: 10,
    constitution: 11,
    intelligence: 13,
    wisdom: 14,
    charsima: 16,
    armorClass: 6,
    initiative: 10,
    speed: 2,
    maxHp: 28,
  },
  skills: [],
  inventory: [],
  abilities: [],
  deck: basicDeck,
  picture: 'hero1.jpg',
};

const hero2 = {
  id: 1,
  name: 'John Estrada',
  race: {
    id: 0,
    name: 'human',
  },
  alignment: 'NEUTRAL_GOOD',
  fields: [],
  level: 1,
  exp: 0,
  attributes: {
    strength: 16,
    dexterity: 12,
    constitution: 14,
    intelligence: 10,
    wisdom: 11,
    charsima: 13,
    armorClass: 4,
    initiative: 11,
    speed: 2,
    maxHp: 32,
  },
  skills: [],
  inventory: [],
  abilities: [],
  deck: basicDeck,
  picture: 'hero2.jpg',
};

const testMonster = {
  id: 2,
  name: 'Test Monster',
  level: 1,
  attributes: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charsima: 10,
    armorClass: 0,
    initiative: 10,
    speed: 1,
    maxHp: 20,
  },
  moves: [
    {
      id: 0,
      name: 'Scratch',
      chance: 1,
      effects: [
        {
          type: 'attack',
          target: 'random',
          args: [2],
          icon: 'sword-icon.png',
        },
      ],
    },
  ],
  picture: 'monster1.jpg',
};

module.exports = {
  hero1,
  hero2,
  testMonster,
  basicDeck,
};
