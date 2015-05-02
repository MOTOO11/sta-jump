/// <reference path="../../typings/bundle.d.ts"/>
/// <reference path="character.ts"/>
module main {
  "use strict";
  export class MainState extends Phaser.State {
    poleGroup: Phaser.Group;
    score: number = 0;
    scoreText: Phaser.Text;
    topScore: number = 0;
    stachoo: character.Stachoo;
    powerBar: Phaser.Sprite;
    powerTween: Phaser.Tween;
    placedPoles: number;
    minPoleGap: number = 100;
    maxPoleGap: number = 300;
    mainState: MainState;
    preload() {
      this.game.load.image("sta", "images/sta.png");
      this.game.load.image("pole", "images/pole.png");
      this.game.load.image("powerbar", "images/powerbar.png");
    }
    create() {
      this.game.stage.backgroundColor = "#87CEEB";
      this.placedPoles = 0;
      this.poleGroup = this.game.add.group();
      this.score = 0;
      this.topScore = localStorage.getItem("topJumpScore") === null ? 0 : <number>localStorage.getItem("topJumpScore");

      this.scoreText = this.game.add.text(10, 10, "-", { font: "bold 16px 'Hiragino Kaku Gothic ProN'" });
      this.updateScore();

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.stachoo = new character.Stachoo(this.game, 80, 0, this, "sta");
      this.addPole(80);
    }

    update() {
      this.game.physics.arcade.collide(this.stachoo, this.poleGroup, this.checkLanding);
      if (this.stachoo.y > this.game.height) {
        this.die();
      }
    }
    updateScore() {
      this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
    }

    addNewPoles() {
      var maxPoleX = 0;
      this.poleGroup.forEach((item: Phaser.Sprite) => {
        maxPoleX = Math.max(item.x, maxPoleX);
      }, null);
      var nextPolePosition = maxPoleX + this.game.rnd.between(this.minPoleGap, this.maxPoleGap);
      this.addPole(nextPolePosition);
    }

    addPole(poleX: number) {
      if (poleX < this.game.width * 2) {
        this.placedPoles++;
        var pole = new character.Pole(this.game, poleX, this.game.rnd.between(250, 380), this);
        this.game.add.existing(pole);
        pole.anchor.set(0.5, 0);
        this.poleGroup.add(pole);
        var nextPolePosition = poleX + this.game.rnd.between(this.minPoleGap, this.maxPoleGap);
        this.addPole(nextPolePosition);
      }
    }
    die() {
      localStorage.setItem("topJumpScore", Math.max(this.topScore, this.score).toString());
      this.game.state.start("main",true);
    }
    checkLanding(stachoo: character.Stachoo, pole: character.Pole) {
      if (pole.y >= stachoo.y + stachoo.height / 2) {
        var border = stachoo.x - pole.x;
        if (Math.abs(border) > 30) {
          stachoo.body.velocity.x = border * 3;
          stachoo.body.velocity.y = -200;
        }
        var poleDiff = pole.poleNumber - stachoo.lastPole;
        if (poleDiff > 0) {
          stachoo.mainState.score += Math.pow(2, poleDiff);
          stachoo.mainState.updateScore();
          stachoo.lastPole = pole.poleNumber;
        }
        if (stachoo.isJumping) {
          stachoo.isJumping = false;
          stachoo.game.input.onDown.add(stachoo.prepareToJump, this);
        }
      } else {
        stachoo.isFallingDown = true;
        pole.body.velocity.x = 0;
        //        this.poleGroup.forEach((item : character.Pole) => {
        //          item.body.velocity.x = 0;
        //        }, null);
      }
    }
  }
}
