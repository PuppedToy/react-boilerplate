const { getDatabase } = require('../utils/getDatabase');

const baseCharacterFields = [
  {
    name: 'Age',
    type: 'WORD',
  },
  {
    name: 'Height',
    type: 'WORD',
  },
  {
    name: 'Weight',
    type: 'WORD',
  },
  {
    name: 'Eyes',
    type: 'WORD',
  },
  {
    name: 'Skin',
    type: 'WORD',
  },
  {
    name: 'Hair',
    type: 'WORD',
  },
  {
    name: 'Personality Traits',
    type: 'SMALL',
  },
  {
    name: 'Ideals',
    type: 'SMALL',
  },
  {
    name: 'Bonds',
    type: 'SMALL',
  },
  {
    name: 'Flaws',
    type: 'SMALL',
  },
  {
    name: 'Other proficiencies and languages',
    type: 'LIST',
  },
  {
    name: 'Character appereance',
    type: 'MEDIUM',
  },
  {
    name: 'Allies and organizations',
    type: 'LIST',
  },
  {
    name: 'Features and traits',
    type: 'LARGE',
  },
  {
    name: 'Character backstory',
    type: 'LARGE',
  },
  {
    name: 'Treasure',
    type: 'MEDIUM',
  },
];

const baseCampaign = {
  name: 'New Campaign',
  description: '',
  characterFields: baseCharacterFields,
  availableRaces: [{}], // TODO
  availableClasses: [{}], // TODO
  customEnemies: [],
  customItems: [],
};

async function create(ownerId) {
  const db = await getDatabase('campaigns');

  const campaign = {
    ...baseCampaign,
    owner: ownerId,
    participants: [
      {
        userId: ownerId,
        characters: [],
        role: 'DM',
      },
    ],
  };
  const result = await db.insertOne(campaign);

  return {
    id: result.insertedId,
    ...campaign,
  };
}
module.exports.create = create;
