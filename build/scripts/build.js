var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/bundle.d.ts"/>
var character;
(function (character) {
    var Stachoo = (function () {
        function Stachoo(game, x, y, key, frame) {
            this.sprite.anchor.set(0.5);
            this.lastPole = 1;
        }
        return Stachoo;
    })();
    character.Stachoo = Stachoo;
    var Pole = (function (_super) {
        __extends(Pole, _super);
        function Pole(game, x, y, stachoo, mainState, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.stachoo = stachoo;
            this.mainState = mainState;
        }
        Pole.prototype.update = function () {
            if (this.stachoo.isJumping && !this.stachoo.isFallingDown) {
                this.body.velocity.x = this.stachoo.jumpPower;
            }
            else {
                this.body.velocity.x = 0;
            }
            if (this.x < -this.width) {
                this.destroy();
                this.mainState.addNewPoles();
            }
        };
        return Pole;
    })(Phaser.Sprite);
    character.Pole = Pole;
})(character || (character = {}));
/// <reference path="../../typings/bundle.d.ts"/>
/// <reference path="character.ts"/>
var main;
(function (main) {
    "use strict";
    var MainState = (function (_super) {
        __extends(MainState, _super);
        function MainState() {
            _super.apply(this, arguments);
            this.score = 0;
            this.minPoleGap = 100;
            this.maxPoleGap = 300;
        }
        MainState.prototype.preload = function () {
            this.game.load.image("stachoo", "images/stamp/stamp042.png");
            this.game.load.image("ninja", "images/ninja.png");
            this.game.load.image("pole", "images/pole.png");
            this.game.load.image("powerbar", "images/powerbar.png");
        };
        MainState.prototype.create = function () {
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
        };
        MainState.prototype.update = function () {
            this.game.physics.arcade.collide(this.stachoo, this.poleGroup, this.chechLanding);
        };
        MainState.prototype.updateScore = function () {
            this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
        };
        MainState.prototype.prepareToJump = function () {
            if (this.stachoo.sprite.body.velocity.y === 0) {
                this.powerBar = this.game.add.sprite(this.stachoo.sprite.x, this.stachoo.sprite.y - 50, "powerbar");
                this.powerBar.width = 0;
                this.powerTween = this.game.add.tween(this.powerBar).to({ width: 100 }, 1000, "Linear", true);
                this.game.input.onDown.remove(this.prepareToJump, this);
                this.game.input.onUp.add(this.jump, this);
            }
        };
        MainState.prototype.jump = function () {
            this.stachoo.jumpPower = -this.powerBar.width * 3 - 100;
            this.powerBar.destroy();
            this.game.tweens.removeAll();
            this.stachoo.sprite.body.velocity.y = this.stachoo.jumpPower * 2;
            this.stachoo.isJumping = true;
            this.powerTween.stop();
            this.game.input.onUp.remove(this.jump, this);
        };
        MainState.prototype.addNewPoles = function () {
            var maxPoleX = 0;
            this.poleGroup.forEach(function (item) {
                maxPoleX = Math.max(item.x, maxPoleX);
            }, null);
        };
        MainState.prototype.addPole = function (poleX) {
            if (poleX < this.game.width * 2) {
                this.placedPoles++;
                var pole = new character.Pole(this.game, poleX, this.game.rnd.between(250, 380), this.stachoo, this);
                this.game.add.existing(pole);
                pole.anchor.set(0.5, 0);
                this.poleGroup.add(pole);
                var nextPolePosition = poleX + this.game.rnd.between(this.minPoleGap, this.maxPoleGap);
                this.addPole(nextPolePosition);
            }
        };
        MainState.prototype.die = function () {
            localStorage.setItem("topJumpScore", Math.max(this.topScore, this.score).toString());
            this.game.state.start("main");
        };
        MainState.prototype.chechLanding = function (n, p) {
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
            }
            else {
                this.stachoo.isFallingDown = true;
                this.poleGroup.forEach(function (item) {
                    item.body.velocity.x = 0;
                }, null);
            }
        };
        return MainState;
    })(Phaser.State);
    main.MainState = MainState;
})(main || (main = {}));
/// <reference path="../../typings/bundle.d.ts"/>
var boot;
(function (boot) {
    var bootState = (function (_super) {
        __extends(bootState, _super);
        function bootState() {
            _super.apply(this, arguments);
        }
        bootState.prototype.preload = function () {
        };
        bootState.prototype.create = function () {
            this.stage.backgroundColor = "#ffffff";
            this.game.state.start("main", false, false);
        };
        return bootState;
    })(Phaser.State);
    boot.bootState = bootState;
})(boot || (boot = {}));
/// <reference path="../../typings/bundle.d.ts" />
/// <reference path="main.ts" />
/// <reference path="boot.ts" />
var Application = (function () {
    function Application(width, height, targetId) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, true);
        this.game.state.add("boot", boot.bootState, false);
        this.game.state.add("main", main.MainState, false);
        this.game.state.start("boot");
    }
    return Application;
})();
window.onload = function () {
    var main = new Application(640, 480, "canvas");
    console.log("This id is '" + main.game.id + "'!");
};
var Global = (function () {
    function Global() {
    }
    return Global;
})();
/// <reference path="../../typings/bundle.d.ts"/>
/// <reference path="./application.ts"/>
/// <reference path="./boot.ts" />
/// <reference path="./main.ts"/>
/// <reference path="./end.ts"/>
/// <reference path="./global.ts"/>
//# sourceMappingURL=build.js.map