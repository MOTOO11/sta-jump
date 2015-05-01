var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/bundle.d.ts"/>
var character;
(function (character) {
    var Stachoo = (function (_super) {
        __extends(Stachoo, _super);
        function Stachoo(game, x, y, main, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.gravity = 800;
            this.isJumping = false;
            this.isFallingDown = false;
            this.mainState = main;
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.anchor.set(0.5);
            this.body.gravity.y = this.gravity;
            this.lastPole = 1;
            game.add.existing(this);
            this.game.input.onDown.add(this.prepareToJump(this), this);
        }
        Stachoo.prototype.prepareToJump = function (stachoo) {
            return function () {
                if (stachoo.body.velocity.y === 0) {
                    stachoo.powerBar = stachoo.game.add.sprite(stachoo.x, stachoo.y - 50, "powerbar");
                    stachoo.powerBar.width = 0;
                    stachoo.powerTween = stachoo.game.add.tween(stachoo.powerBar).to({ width: 100 }, 1000, "Linear", true);
                    stachoo.game.input.onDown.remove(stachoo.prepareToJump, stachoo);
                    stachoo.game.input.onUp.add(stachoo.jump(stachoo), stachoo);
                }
            };
        };
        Stachoo.prototype.jump = function (stachoo) {
            return function () {
                stachoo.jumpPower = -stachoo.powerBar.width * 3 - 100;
                stachoo.powerBar.destroy();
                stachoo.game.tweens.removeAll();
                stachoo.body.velocity.y = stachoo.jumpPower * 2;
                stachoo.isJumping = true;
                stachoo.powerTween.stop();
                stachoo.game.input.onUp.remove(stachoo.jump, stachoo.game);
            };
        };
        return Stachoo;
    })(Phaser.Sprite);
    character.Stachoo = Stachoo;
    var Pole = (function (_super) {
        __extends(Pole, _super);
        function Pole(game, x, y, stachoo, mainState, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.stachoo = stachoo;
            this.mainState = mainState;
            Phaser.Sprite.call(this, game, x, y, "pole");
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.immovable = true;
            this.poleNumber = mainState.placedPoles;
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
            this.topScore = 0;
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
            this.game.stage.backgroundColor = "#87CEEB";
            this.placedPoles = 0;
            this.poleGroup = this.game.add.group();
            this.score = 0;
            this.topScore = localStorage.getItem("topJumpScore") === null ? 0 : localStorage.getItem("topJumpScore");
            this.scoreText = this.game.add.text(10, 10, "-", { font: "bold 16px 'Hiragino Kaku Gothic ProN'" });
            this.updateScore();
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.stachoo = new character.Stachoo(this.game, 80, 0, this, "ninja");
            this.addPole(80);
        };
        MainState.prototype.update = function () {
            this.game.physics.arcade.collide(this.stachoo, this.poleGroup, this.checkLanding);
            if (this.stachoo.y > this.game.height) {
                this.die();
            }
        };
        MainState.prototype.updateScore = function () {
            this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
        };
        MainState.prototype.addNewPoles = function () {
            var maxPoleX = 0;
            this.poleGroup.forEach(function (item) {
                maxPoleX = Math.max(item.x, maxPoleX);
            }, null);
            var nextPolePosition = maxPoleX + this.game.rnd.between(this.minPoleGap, this.maxPoleGap);
            this.addPole(nextPolePosition);
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
        MainState.prototype.checkLanding = function (stachoo, pole) {
            if (pole.y >= stachoo.y + stachoo.height / 2) {
                var border = stachoo.x - pole.x;
                if (Math.abs(border) > 30) {
                    stachoo.body.velocity.x = border * 2;
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
            }
            else {
                stachoo.isFallingDown = true;
                pole.body.velocity.x = 0;
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
        this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, false);
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