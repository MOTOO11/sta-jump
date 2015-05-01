/// <reference path="../../typings/bundle.d.ts"/>
module character {
  export class Stachoo {
    gravity: number;
    jumpPower: number;
    isJumping: boolean;
    isFallingDown: boolean;
    lastPole: number;
    sprite: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number, key?: string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame?: string|number) {
      this.sprite.anchor.set(0.5);
      this.lastPole = 1;
    }
  }
  export class Pole extends Phaser.Sprite {
    poleNumber: number;
    stachoo: Stachoo;
    mainState: main.MainState;
    constructor(game: Phaser.Game, x: number, y: number, stachoo: Stachoo, mainState: main.MainState, key?: string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame?: string|number) {
      super(game, x, y, key, frame);
      this.stachoo = stachoo;
      this.mainState = mainState;
    }
    update() {
      if (this.stachoo.isJumping && !this.stachoo.isFallingDown) {
        this.body.velocity.x = this.stachoo.jumpPower;
      }
      else {
        this.body.velocity.x = 0
      }
      if (this.x < -this.width) {
        this.destroy();
        this.mainState.addNewPoles();
      }
    }
  }
}