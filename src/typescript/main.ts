/// <reference path="../../typings/bundle.d.ts"/>
/// <reference path="character.ts"/>
module main {
  "use strict";
  export class MainState extends Phaser.State {
    poleGroup: Phaser.Group;
    score: number = 0;
    scoreText: Phaser.Text;
    topScore: number;
    stachoo: character.Stachoo;
    powerBar: Phaser.Sprite;
    powerTween: Phaser.Tween;
    placedPoles: number;
    minPoleGap: number = 100;
    maxPoleGap: number = 300;
    preload() {
      this.game.load.image("stachoo", "images/stamp/stamp042.png");
      this.game.load.image("ninja", "images/ninja.png");
      this.game.load.image("pole", "images/pole.png");
      this.game.load.image("powerbar", "images/powerbar.png");
    }
    create() {
      this.placedPoles = 0;
      this.poleGroup = this.game.add.group();
      this.scoreText = this.game.add.text(10, 10, "-", { font: "bold 16px Arial" });
      this.updateScore();
      this.game.stage.backgroundColor = "#87CEEB";
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.stachoo.sprite = this.game.add.sprite(80, 0, "ninja");
      this.game.physics.arcade.enable(this.stachoo);
      this.game.input.onDown.add(this.prepareToJump, this);
      this.addPole(80);
    }

    update() {
      this.game.physics.arcade.collide(this.stachoo, this.poleGroup, this.chechLanding);
    }
    updateScore() {
      this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
    }

    prepareToJump() {
      if (this.stachoo.sprite.body.velocity.y === 0) {
        this.powerBar = this.game.add.sprite(this.stachoo.sprite.x, this.stachoo.sprite.y - 50, "powerbar");
        this.powerBar.width = 0;
        this.powerTween = this.game.add.tween(this.powerBar).to({ width: 100 }, 1000, "Linear", true);
        this.game.input.onDown.remove(this.prepareToJump, this);
        this.game.input.onUp.add(this.jump, this);
      }
    }
    jump() {
      this.stachoo.jumpPower = -this.powerBar.width * 3 - 100;
      this.powerBar.destroy();
      this.game.tweens.removeAll();
      this.stachoo.sprite.body.velocity.y = this.stachoo.jumpPower * 2;
      this.stachoo.isJumping = true;
      this.powerTween.stop();
      this.game.input.onUp.remove(this.jump, this);
    }
    addNewPoles() {
      var maxPoleX = 0;
      this.poleGroup.forEach((item : Phaser.Sprite) => {
        maxPoleX = Math.max(item.x, maxPoleX);
      }, null);
    }

    addPole(poleX: number) {
      if (poleX < this.game.width * 2) {
        this.placedPoles++;
        var pole = new character.Pole(this.game, poleX, this.game.rnd.between(250, 380), this.stachoo, this);
        this.game.add.existing(pole);
        pole.anchor.set(0.5, 0);
        this.poleGroup.add(pole);
        var nextPolePosition = poleX + this.game.rnd.between(this.minPoleGap, this.maxPoleGap);
        this.addPole(nextPolePosition);
      }
    }
    die() {
      localStorage.setItem("topJumpScore", Math.max(this.topScore, this.score).toString());
      this.game.state.start("main");
    }
    chechLanding(n: character.Stachoo, p: character.Pole) {
      if (p.y >= n.sprite.y + n.sprite.height / 2) {
        var border = n.sprite.x - p.x;
        if (Math.abs(border) > 20) {
          n.sprite.body.velocity.x = border * 2;
          n.sprite.body.velocity.y = -200;
        }
        var poleDiff = p.poleNumber - n.lastPole;
        if (poleDiff > 0) {
          this.score += Math.pow(2, poleDiff);
          this.updateScore();
          n.lastPole = p.poleNumber;
        }
        if (this.stachoo.isJumping) {
          this.stachoo.isJumping = false;
          this.game.input.onDown.add(this.prepareToJump, this);
        }
      }else {
        this.stachoo.isFallingDown = true;
        this.poleGroup.forEach((item : Phaser.Sprite) => {
          item.body.velocity.x = 0;
        }, null);
      }
    }
  }
}
