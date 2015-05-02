/// <reference path="../../typings/bundle.d.ts"/>
module boot {
  export class bootState extends Phaser.State {
    title: Phaser.Sprite;
    preload() {
      this.game.load.image("title", "images/stamp/stamp018.png");
    }
    create() {
      this.stage.backgroundColor = "#87CEEB";
      this.title = this.game.add.sprite(230, 50, "title");
      this.game.input.onDown.add(() => {
        var tween = this.add.tween(this.title).to({ x: -50, y: -800 }, 1000, Phaser.Easing.Quadratic.In)
          .to({ x: -300, y: -800 }, 400, Phaser.Easing.Quadratic.In).start();
        var tween2 = this.add.tween(this.title.scale).to({ x: 0.2, y: 0.2 }, 1000, Phaser.Easing.Quadratic.In, true);
        tween.onComplete.add(() => {
          this.game.state.start("main", true, false);
        }, this);
      });
    }
  }
}
