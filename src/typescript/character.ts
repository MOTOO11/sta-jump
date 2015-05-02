/// <reference path="../../typings/bundle.d.ts"/>
module character {
  "use strict";
  export class Stachoo extends Phaser.Sprite {
    gravity: number = 800;
    jumpPower: number;
    isJumping: boolean = false;
    isFallingDown:boolean = false;
    lastPole: number;
    powerBar: Phaser.Sprite;
    powerTween: Phaser.Tween;
    mainState: main.MainState;

    constructor(game: Phaser.Game, x: number, y: number, main: main.MainState, key?: string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame?: string|number) {
      super(game, x, y, key, frame);
      this.isJumping=false;
      this.isFallingDown=false;
      this.mainState = main;
      game.physics.enable(this, Phaser.Physics.ARCADE);
      this.anchor.set(0.5);
      this.body.gravity.y = this.gravity;
      this.lastPole = 1;
      game.add.existing(this);
      this.game.input.onDown.add(this.prepareToJump(this), this);
    }

    prepareToJump(stachoo: Stachoo) {
      return () => {
        if (stachoo.body.velocity.y === 0) {
          stachoo.powerBar = stachoo.game.add.sprite(stachoo.x, stachoo.y - 50, "powerbar");
          stachoo.powerBar.width = 0;
          stachoo.powerTween = stachoo.game.add.tween(stachoo.powerBar).to({ width: 100 }, 1000, "Linear", true);
          stachoo.game.input.onDown.remove(stachoo.prepareToJump, stachoo);
          stachoo.game.input.onUp.add(stachoo.jump(stachoo), stachoo);
        }
      }
    }
    jump(stachoo: Stachoo) {
      return () => {
        stachoo.jumpPower = -stachoo.powerBar.width * 3 - 100;
        stachoo.powerBar.destroy();
        stachoo.game.tweens.removeAll();
        stachoo.body.velocity.y = stachoo.jumpPower * 2;
        stachoo.isJumping = true;
        stachoo.powerTween.stop();
        stachoo.game.input.onUp.removeAll();
        //stachoo.game.input.onUp.remove(stachoo.jump, stachoo.game);
      }
    }
  }
  export class Pole extends Phaser.Sprite {
    poleNumber: number;
    mainState: main.MainState;
    constructor(game: Phaser.Game, x: number, y: number, mainState: main.MainState, key?: string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame?: string|number) {
      super(game, x, y, key, frame);
      this.mainState = mainState;
      Phaser.Sprite.call(this, game, x, y, "pole");
      game.physics.enable(this, Phaser.Physics.ARCADE);
      this.body.immovable = true;
      this.poleNumber = mainState.placedPoles;
    }
    update() {
      var stachoo = this.mainState.stachoo;
      if (stachoo.isJumping && !stachoo.isFallingDown) {
        this.body.velocity.x = stachoo.jumpPower;
      } else {
        this.body.velocity.x = 0
      }
      if (this.x < -this.width) {
        this.destroy();
        this.mainState.addNewPoles();
      }
    }
  }
}