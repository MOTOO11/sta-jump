/// <reference path="../../typings/bundle.d.ts"/>
module boot {
  export class bootState extends Phaser.State {
    preload() {
      // this.game.load.json("staMap", "js/sta.json");
    }
    create() {
      this.stage.backgroundColor = "#ffffff";
      this.game.state.start("main", false, false);
    }
  }
}
