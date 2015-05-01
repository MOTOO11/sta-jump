/// <reference path="../../typings/bundle.d.ts" />
/// <reference path="main.ts" />
/// <reference path="boot.ts" />
class Application {
  "use strict";
  game: Phaser.Game;
  constructor(width: number, height: number, targetId: string) {
    this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, false);
    this.game.state.add("boot", boot.bootState, false);
    this.game.state.add("main", main.MainState, false);
    this.game.state.start("boot");
  }
}

window.onload = () => {
  var main: Application = new Application(640, 480, "canvas");
  console.log("This id is '" + main.game.id + "'!");
};
