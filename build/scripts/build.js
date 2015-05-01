var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/bundle.d.ts"/>
var scene;
(function (scene) {
    "use strict";
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.apply(this, arguments);
            this.style = { font: "40px sans", fill: "#DE4830", align: "left" };
        }
        Scene.prototype.preload = function () {
            this.game.load.image("bg01", "images/background/pipo-battlebg001.jpg");
            this.game.load.image("live_logo", "images/live_logo.png");
            this.game.load.image("fence", "images/foreground/fence.png");
        };
        Scene.prototype.create = function () {
            this.stage.backgroundColor = "#ccc";
            this.game.stage.disableVisibilityChange = true;
        };
        Scene.prototype.update = function () {
        };
        return Scene;
    })(Phaser.State);
    scene.Scene = Scene;
})(scene || (scene = {}));
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
/// <reference path="scene.ts" />
/// <reference path="boot.ts" />
var Application = (function () {
    function Application(width, height, targetId) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, true);
        this.game.state.add("boot", boot.bootState, false);
        this.game.state.add("main", scene.Scene, false);
        this.game.state.start("boot");
    }
    return Application;
})();
window.onload = function () {
    var main = new Application(600, 400, "canvas");
    console.log("This id is '" + main.game.id + "'!");
};
var Global = (function () {
    function Global() {
    }
    Global.IMAGE_AVARAGE_WIDTH = 300;
    Global.IMAGE_AVARAGE_HEIGHT = 300;
    return Global;
})();
/// <reference path="../../typings/bundle.d.ts"/>
/// <reference path="./Application.ts"/>
/// <reference path="./boot.ts" />
/// <reference path="./scene.ts"/>
/// <reference path="./global.ts"/>
//# sourceMappingURL=build.js.map