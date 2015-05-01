/// <reference path="../../typings/bundle.d.ts" />
/// <reference path="scene.ts" />
/// <reference path="boot.ts" />
class Application {
  "use strict";
  game: Phaser.Game;
  constructor(width: number, height: number, targetId: string) {
    this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, true);
    this.game.state.add("boot", boot.bootState, false);
    this.game.state.add("main", scene.Scene, false);
    this.game.state.start("boot");
  }
}

window.onload = () => {
  var main: Application = new Application(600, 400, "canvas");
  console.log("This id is '" + main.game.id + "'!");
};
