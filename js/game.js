// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {
  this.playerSpeed = 1.5;
  this.enemySpeed = 2;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
  // this.scaleRatio = window.devicePixelRatio / 3;
}

// load asset files for our game
gameScene.preload = function () {

  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function () {

  // background
  let bg = this.add.sprite(0, 0, 'background');

  // change origin to the top-left of the sprite
  bg.setOrigin(0, 0);

  // bg.setScale(this.sys.game.config.width / 640, this.sys.game.config.height / 360)
  // this.bg = this.add.sprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0);
  // bg.setScale(this.scaleRatio);

  // player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

  // scale down
  this.player.setScale(0.5);
  // this.player.setScale(1 / (this.sys.game.config.height * 72));

  // goal
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.6);

  // group of enemies
  this.enemies = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });

  // scale enemies
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  // set speeds
  Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
    enemy.speed = Math.random() * 2 + 1;
  }, this);

  // player is alive
  this.isPlayerAlive = true;

  // player has won
  this.hasPlayerWon = false;

  // reset camera
  this.cameras.main.resetFX();

  // this.events.on('resize', resize, this);

};


// gameScene.resize = function(width, height) {

//   if (width === undefined) { width = this.sys.game.config.width; }
//     if (height === undefined) { height = this.sys.game.config.height; }

//     this.cameras.resize(width, height);

//     this.bg.setSize(width, height);
// }



// executed on every frame (60 times per second)
gameScene.update = function () {

  // only if the player is alive
  if (!this.isPlayerAlive) {
    return;
  }

  // check for active input
  if (this.input.activePointer.isDown) {

    // player walks
    this.player.x += this.playerSpeed;
  }

  // treasure collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.playerWon();
  }

  // enemy movement and collision
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {

    // move enemies
    enemies[i].y += enemies[i].speed;

    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY /*&& enemies[i].speed > 0*/) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY /*&& enemies[i].speed < 0*/) {
      enemies[i].speed *= -1;
    }

    // enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
};

gameScene.gameOver = function () {

  // flag to set player is dead
  this.isPlayerAlive = false;

  // shake the camera
  this.cameras.main.shake(500);

  // fade camera
  this.time.delayedCall(250, function () {
    this.cameras.main.fade(250);
  }, [], this);

  // restart game
  this.time.delayedCall(500, function () {
    this.scene.restart();
  }, [], this);
};

gameScene.playerWon = function () {

  this.scoreText = this.add.text(70, 170, 'You have got the treasure!', { fontSize: '32px', fill: '#FFF', backgroundColor: '#000' });

  // // restart game
  this.time.delayedCall(100, function () {
    this.scene.pause();
  }, [], this);
};


// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  title: "Crossy",
  url: "https://perezsebas.github.io/crossyGame/",
  // type: Phaser.CANVAS,
  // width: window.innerWidth * window.devicePixelRatio,
  // height: window.innerHeight * window.devicePixelRatio,
  // width: window.innerWidth,
  // height: window.innerHeight,
  scene: gameScene
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);

// game.scale.scaleMode = Phaser.scaleMode.SHOW_ALL;

// window.addEventListener('resize', function (event) {

//   gameScene.resize(window.innerWidth, window.innerHeight);

// }, false);