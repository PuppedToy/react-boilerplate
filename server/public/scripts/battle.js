/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

const socket = io('http://localhost:3000');
const battleId = window.location.href.replace(/.*battleId=/, '');
const ASSET_PREFIX = '/api/public/images/';

// Ingame variables
let teams;
let player;

socket.on('hello', () => {
  const token = localStorage.getItem('token');
  console.log(`Received hello. Emitting hello with token ${token}`);
  socket.emit('hello', { token, type: 'BATTLE' });
});

socket.on('error', ({ message }) => {
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = message;
  errorContainer.classList.remove('hidden');
  setTimeout(() => {
    errorContainer.classList.add('hidden');
  }, 10000);
  console.error(message);
});

socket.on('unauthorized', () => {
  window.location.href = '/login';
});

socket.on('authorized', () => {
  console.log(
    `Received authorized. Sending battle-connect with battleId ${battleId}`,
  );
  socket.emit('battle-connect', { battleId });
});

socket.on('battle-start', payload => {
  ({ teams, player } = payload);
  console.log('Received battle-start with the following payload', payload);
  start(payload.assets);
});

const app = new PIXI.Application({
  width: 256,
  height: 256,
  autoDensity: true,
  resizeTo: document.getElementsByTagName('body')[0],
});

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.backgroundColor = 0xffffff;
document.body.appendChild(app.view);

// TODO
// eslint-disable-next-line no-unused-vars
function start(assets) {
  PIXI.Loader.shared.add(assets).load(setup);
}

function onDragStart(event) {
  this.data = event.data;
  this.relative = {
    x: this.data.global.x - this.position.x,
    y: this.data.global.y - this.position.y,
  };
  this.dragging = true;
}

function onDragEnd() {
  this.dragging = false;

  // set the interaction data to null
  this.data = null;
  this.relative = null;
  this.interactive = false;

  const TIMES = 10;

  const angleDiff =
    ((this.origin.angle > 180 ? this.origin.angle - 360 : this.origin.angle) -
      (this.angle > 180 ? this.angle - 360 : this.angle)) /
    TIMES;
  const xDiff = (this.origin.x - this.x) / TIMES;
  const yDiff = (this.origin.y - this.y) / TIMES;

  let count = 0;
  this.interval = setInterval(() => {
    if (count < TIMES) {
      this.angle += angleDiff;
      this.x += xDiff;
      this.y += yDiff;
    } else {
      this.angle = this.origin.angle;
      this.x = this.origin.x;
      this.y = this.origin.y;
      this.interactive = true;
      clearInterval(this.interval);
      this.interval = undefined;
    }
    count += 1;
  }, 30);
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.position.set(
      newPosition.x - this.relative.x,
      newPosition.y - this.relative.y,
    );
    if (this.angle <= 180 && this.angle >= 1) this.angle -= 2;
    else if ((this.angle < 1 && this.angle > 0) || this.angle < 0)
      this.angle = 0;
    else if (this.angle > 180 && this.angle <= 359) this.angle += 2;
    else if (this.angle > 359) this.angle = 0;
  }
}

function createCard({ picture, cost }) {
  const sprite = new PIXI.Sprite(
    PIXI.Loader.shared.resources['/api/public/images/cardoutline.png'].texture,
  );
  const container = new PIXI.Container();
  sprite.width *= 0.3;
  sprite.height *= 0.3;
  const graphics = new PIXI.Graphics();
  container.addChild(sprite);
  graphics.beginFill(0xffffff);
  graphics.lineStyle(2, 0x000000);
  graphics.drawRect(20, 20, 180, 140);
  graphics.drawCircle(10, 10, 14);
  container.addChild(graphics);
  const costSprite = new PIXI.Text(cost, {
    fontFamily: 'Arial',
    fontSize: 16,
    align: 'center',
  });
  costSprite.position.set(5, 2);
  container.addChild(costSprite);
  const drawing = new PIXI.Sprite(
    PIXI.Loader.shared.resources[`${ASSET_PREFIX}${picture}`].texture,
  );
  drawing.position.set(20, 20);
  drawing.width = 180;
  drawing.height = 140;
  container.addChild(drawing);
  draggable(container);
  return container;
}

const teamColors = [
  0x293e85,
  0x852f29,
  0x338529,
  0xe8e630,
  0xe89730,
  0xf162ff,
  0x58fff0,
];
function createCharacterSprite(character, gridSize, id, teamsNumber) {
  const gridX = parseInt(id / gridSize, 10);
  const gridY = id % gridSize;

  const teamWidth = app.renderer.width / teamsNumber;
  const teamHeight = app.renderer.height * 0.8;

  const cellWidth = teamWidth / gridSize;
  const cellHeight = teamHeight / gridSize;

  const x = gridX * cellWidth + character.team * teamWidth;
  const y = gridY * cellHeight;

  const picSize = Math.min(cellWidth, cellHeight * 0.9);

  const container = new PIXI.Container();
  const graphics = new PIXI.Graphics();
  // graphics.beginFill(0xFFFFFF);
  // graphics.lineStyle(1, 0x000000);
  // graphics.drawRect(x, y, cellWidth, cellHeight);
  graphics.beginFill(teamColors[character.team]);
  graphics.lineStyle(0);
  graphics.drawRect(x + 5, y + picSize - 5, picSize - 10, cellHeight * 0.09);
  container.addChild(graphics);

  const sprite = new PIXI.Sprite(
    PIXI.Loader.shared.resources[`${ASSET_PREFIX}${character.picture}`].texture,
  );
  sprite.position.set(x + 5, y + 5);
  sprite.width = picSize - 10;
  sprite.height = picSize - 10;
  container.addChild(sprite);
  return container;
}

function draggable(sprite) {
  sprite.interactive = true;
  return sprite
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);
}

function buildDeck({ deck, deckSize, deckMargin, reversed = false }) {
  const deckSprite = new PIXI.Sprite(
    PIXI.Loader.shared.resources[`${ASSET_PREFIX}deck.png`].texture,
  );
  const deckX = reversed ? app.renderer.width - deckMargin : deckMargin;
  const deckY = app.renderer.height - deckMargin - deckSize;
  deckSprite.position.set(deckX, deckY);
  deckSprite.height = deckSize;
  deckSprite.width = reversed ? -deckSize : deckSize;
  app.stage.addChild(deckSprite);

  const deckCardNumberCircleSprite = new PIXI.Graphics();
  deckCardNumberCircleSprite.beginFill(0xffffff);
  deckCardNumberCircleSprite.lineStyle(2, 0x000000);
  deckCardNumberCircleSprite.drawCircle(9, 9, 14);
  const deckCardNumberSprite = new PIXI.Text(deck.length, {
    fontFamily: 'Arial',
    fontSize: 16,
    align: 'center',
  });
  const deckCardNumberContainer = new PIXI.Container();
  deckCardNumberContainer.addChild(deckCardNumberCircleSprite);
  deckCardNumberContainer.addChild(deckCardNumberSprite);
  deckCardNumberContainer.position.set(
    reversed
      ? app.renderer.width - deckSize - 2 * deckMargin
      : deckSize + deckMargin,
    app.renderer.height - deckMargin - deckSize,
  );
  app.stage.addChild(deckCardNumberContainer);
}

function setup() {
  const { hand, deck, discardPile } = player;
  const cardSprites = hand.map(card => createCard(card));

  teams.forEach(team => {
    const gridSize = parseInt(Math.sqrt(team.members.length), 10) + 1;
    team.members.forEach(({ character }, id) => {
      const characterSprite = createCharacterSprite(
        character,
        gridSize,
        id,
        teams.length,
      );
      app.stage.addChild(characterSprite);
    });
  });

  cardSprites.forEach((card, index) => {
    const cardsZoneSize = app.renderer.width * 0.8;
    const angle =
      (-((hand.length / 2 - index) * (90 / hand.length)) + 360) % 360;
    const rotationDeviation = angle - 180;

    const rotationCorrectionAbs = (180 - Math.abs(rotationDeviation)) / 180;

    const negativeAngle = -((hand.length / 2 - index) * (90 / hand.length));
    const rotationCorrection = negativeAngle / 360;
    const rotationCorrectionX = -rotationCorrection * card.width * 4;
    const x =
      app.renderer.width / 2 -
      card.width / 4 -
      cardsZoneSize / 2 +
      (cardsZoneSize / hand.length) * index +
      rotationCorrectionX;

    const rotationCorrectionY =
      rotationCorrectionAbs *
      card.height *
      60 *
      ((x - app.renderer.width / 2) / app.renderer.width / 2) ** 2;
    const y = app.renderer.height - card.height * 0.7 + rotationCorrectionY;
    card.position.set(x, y);
    card.angle = angle;
    card.origin = { x, y, angle };
    app.stage.addChild(card);
  });

  const DECK_SIZE = 100;
  const DECK_MARGIN = 20;
  buildDeck({ deck, deckSize: DECK_SIZE, deckMargin: DECK_MARGIN });
  buildDeck({
    deck: discardPile,
    deckSize: DECK_SIZE,
    deckMargin: DECK_MARGIN,
    reversed: true,
  });
}
