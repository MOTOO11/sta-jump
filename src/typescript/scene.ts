/// <reference path="../../typings/bundle.d.ts"/>
module scene {
  "use strict";
  export class Scene extends Phaser.State {
    background: Phaser.Sprite;
    style: Object = { font: "40px sans", fill: "#DE4830", align: "left" };
    preload() {
      this.game.load.image("bg01", "images/background/pipo-battlebg001.jpg");
      this.game.load.image("live_logo", "images/live_logo.png");
      this.game.load.image("fence", "images/foreground/fence.png");
    }
    create() {
      this.stage.backgroundColor = "#ccc";
      this.game.stage.disableVisibilityChange = true;
    }

    update() {
    }
    // もしエフェクトを掛けたりする場合にはここで
    // render(){
    // }
  }
}
