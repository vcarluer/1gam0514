(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappyburst');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

  // initialize your prefab here
    // set the sprite's anchor to the center
    this.anchor.setTo(0.5, 0.5);

    // add and play animations
    this.animations.add('flap');
    this.animations.play('flap', 12, true);

    this.game.physics.arcade.enableBody(this);
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
    // check to see if our angle is less than 90
    // if it is rotate the bird towards the ground by 2.5 degrees
    if(this.angle < 90) {
        this.angle += 2.5;
    }
};

Bird.prototype.flap = function() {
    this.body.velocity.y = -400;
    // rotate the bird to -40 degrees
    this.game.add.tween(this).to({angle: -40}, 100).start();
};

module.exports = Bird;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
    Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

    // start scrolling our ground
    this.autoScroll(-200,0);

    // enable physics on the ground sprite
    // this is needed for collision detection
    this.game.physics.arcade.enableBody(this);

    // we don't want the ground's body
    // to be affected by gravity
    this.body.allowGravity = false;
    this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enableBody(this);

    this.body.allowGravity = false;
    this.body.immovable = true;
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Pipe;

},{}],5:[function(require,module,exports){
'use strict';

var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.topPipe = new Pipe(this.game, 0, 0, 0);
    this.add(this.topPipe);

    this.bottomPipe = new Pipe(this.game, 0, 440, 1);
    this.add(this.bottomPipe);

    this.hasScored = false;
    this.width = this.topPipe.width;

    this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
    this.checkWorldBounds();
};

PipeGroup.prototype.reset = function(x, y) {

    // Step 1
    this.topPipe.reset(0,0);

    // Step 2
    this.bottomPipe.reset(0,440); // Step 2

    // Step 3
    this.x = x;
    this.y = y;

    // Step 4
    this.setAll('body.velocity.x', -200);

    // Step 5
    this.hasScored = false;

    // Step 6
    this.exists = true;
};

PipeGroup.prototype.checkWorldBounds = function() {
    if(!this.topPipe.inWorld) {
        this.exists = false;
    }
};

module.exports = PipeGroup;

},{"./pipe":4}],6:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],7:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){
'use strict';
function Menu() {}

Menu.prototype = {
    preload: function() {
    },
    create: function() {
        // add the background sprite
        this.background = this.game.add.sprite(0, 0, 'background');
        // add the ground sprite as a tile
        // and start scrolling in the negative x direction
        this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
        this.ground.autoScroll(-200, 0);

        /** STEP 1 **/
            // create a group to put the title assets in
            // so they can be manipulated as a whole
        this.titleGroup = this.game.add.group();

        /** STEP 2 **/
            // create the title sprite
            // and add it to the group
        this.title = this.game.add.sprite(0,0,'title');
        this.titleGroup.add(this.title);

        /** STEP 3 **/
            // create the bird sprite
            // and add it to the title group
        this.bird = this.game.add.sprite(200,5,'bird');
        this.titleGroup.add(this.bird);

        /** STEP 4 **/
            // add an animation to the bird
            // and begin the animation
        this.bird.animations.add('flap');
        this.bird.animations.play('flap', 12, true);

        /** STEP 5 **/
            // Set the originating location of the group
        this.titleGroup.x = 30;
        this.titleGroup.y = 100;

        /** STEP 6 **/
            // create an oscillating animation tween for the group
        this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

        // add our start button with a callback
        this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
        this.startButton.anchor.setTo(0.5,0.5);

    },
    update: function() {
    },
    startClick: function() {
        // start button click handler
        // start the 'play' state
        this.game.state.start('play');
    }
};
module.exports = Menu;
},{}],9:[function(require,module,exports){
  'use strict';

  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');

  function Play() {}
  Play.prototype = {
      create: function() {
          this.game.physics.startSystem(Phaser.Physics.ARCADE);
          this.game.physics.arcade.gravity.y = 1200;
          // add the background sprite
          this.background = this.game.add.sprite(0,0,'background');

          // Create a new bird object
          this.bird = new Bird(this.game, 100, this.game.height/2);
          // and add it to the game
          this.game.add.existing(this.bird);

          // create and add a group to hold our pipeGroup prefabs
          this.pipes = this.game.add.group();

          // create and add a new Ground object
          this.ground = new Ground(this.game, 0, 400, 335, 112);
          this.game.add.existing(this.ground);

          // keep the spacebar from propogating up to the browser
          this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

          // add keyboard controls
          var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          flapKey.onDown.add(this.bird.flap, this.bird);


          // add mouse/touch controls
          this.input.onDown.add(this.bird.flap, this.bird);

          // add a timer
          this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
          this.pipeGenerator.timer.start();

      },
      generatePipes: function() {
          var pipeY = this.game.rnd.integerInRange(-100, 100);
          var pipeGroup = this.pipes.getFirstExists(false);
          if(!pipeGroup) {
              pipeGroup = new PipeGroup(this.game, this.pipes);
          }
          pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);
      },
      deathHandler: function() {
          this.game.state.start('gameover');
      },
      update: function() {
          // enable collisions between the bird and the ground
          this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
          // enable collisions between the bird and each group in the pipes group
          this.pipes.forEach(function(pipeGroup) {
              this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
          }, this);

      }
  };
  
  module.exports = Play;
},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipeGroup":5}],10:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
      this.load.image('background', 'assets/background.png');
      this.load.image('ground', 'assets/ground.png');
      this.load.image('title', 'assets/title.png');
      this.load.image('startButton', 'assets/start-button.png');

      this.load.spritesheet('pipe', 'assets/pipes.png', 54,320,2);
      this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])