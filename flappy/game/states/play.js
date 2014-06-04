  'use strict';

  var Bird = require('../prefabs/bird');
  var Ground = require('../prefabs/ground');
  var PipeGroup = require('../prefabs/pipeGroup');
  var Scoreboard = require('../prefabs/Scoreboard');

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

          this.top = new Ground(this.game, 0, -10, this.game.width, 10);
          this.game.add.existing(this.top);

          this.instructionGroup = this.game.add.group();
          this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'));
          this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'));
          this.instructionGroup.setAll('anchor.x', 0.5);
          this.instructionGroup.setAll('anchor.y', 0.5);


          // keep the spacebar from propogating up to the browser
          this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        // add keyboard controls
          this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          this.flapKey.onDown.addOnce(this.startGame, this);
          this.flapKey.onDown.add(this.bird.flap, this.bird);


          // add mouse/touch controls
          this.game.input.onDown.addOnce(this.startGame, this);
          this.game.input.onDown.add(this.bird.flap, this.bird);

          this.score = 0;

          this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
          this.scoreText.visible = false;

          this.scoreSound = this.game.add.audio('score');
          this.pipeHitSound = this.game.add.audio('pipeHit');
          this.groundHitSound = this.game.add.audio('groundHit');
      },
      startGame: function() {
          this.bird.body.allowGravity = true;
          this.bird.alive = true;

          // add a timer
          this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
          this.pipeGenerator.timer.start();

          this.instructionGroup.destroy();
          this.scoreText.visible = true;
      },
      generatePipes: function() {
          var pipeY = this.game.rnd.integerInRange(-100, 100);
          var pipeGroup = this.pipes.getFirstExists(false);
          if(!pipeGroup) {
              pipeGroup = new PipeGroup(this.game, this.pipes);
          }
          pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);
      },
      hitPipe: function() {
          this.pipeHitSound.play();
          this.deathHandler();
      },
      hitGround: function() {
          this.groundHitSound.play();
          this.deathHandler();
      },
      deathHandler: function() {
          this.bird.alive = false;
          this.pipes.forEach(function (pipeGroup) {
              pipeGroup.setAll('body.velocity.x', 0);
          }, this);

          this.pipes.callAll('stop');
          this.pipeGenerator.timer.stop();
          this.ground.stopScroll();
          this.scoreboard = new Scoreboard(this.game);
          this.game.add.existing(this.scoreboard);
          this.scoreboard.show(this.score);
      },
      checkScore: function(pipeGroup) {
          if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
              pipeGroup.hasScored = true;
              this.score++;
              this.scoreText.setText(this.score.toString());
              this.scoreSound.play();
          }
      },
      shutdown: function() {
          this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
          this.bird.destroy();
          this.pipes.destroy();
          this.scoreboard.destroy();
      },
      update: function() {
          if (this.bird.alive) {
              // enable collisions between the bird and the ground
              this.game.physics.arcade.collide(this.bird, this.ground, this.hitGround, null, this);
              this.game.physics.arcade.collide(this.bird, this.top, null, null, this);
              // enable collisions between the bird and each group in the pipes group
              this.pipes.forEach(function (pipeGroup) {
                  this.checkScore(pipeGroup);
                  this.game.physics.arcade.collide(this.bird, pipeGroup, this.hitPipe, null, this);
              }, this);
          }
      }
  };
  
  module.exports = Play;