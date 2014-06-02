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