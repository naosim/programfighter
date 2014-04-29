(function() {
    var startGame = function(game, fps, getCode, stage, scoreView) {
        return function() {
            var code = getCode();
            scoreView.dismiss();

            var scene = new Scene();
            var hero = new Hero(game, code, program, stage);
            var shotLayer = new Group();
            var enemyShotLayer = new Group();
            game.fps = fps;
            game.hero = hero;
            game.shotLayer = shotLayer;
            game.enemyShotLayer = enemyShotLayer;
            scene.addChild(shotLayer);
            scene.addChild(enemyShotLayer);
            scene.addChild(hero.sprite);

            stage.setup(game, scene);

            game.popScene();
            game.pushScene(scene);
            game.score.resetTime();
            game.score.setCode(code);
            game.resume();

            
        };
    };

    var enterframe = function(game, stage, scoreView) {
        return function() {
            if(!game.hero) {
                
            }
            else if(game.hero.isDead) {
                scoreView.lose(game.score, game.hero, stage.bossPower());
                game.pause();
            }
            else if(stage.isWin()) {
                scoreView.win(game.score, game.hero, stage.bossPower());
                game.pause();
            }
            else {
                game.score.enterframe(game.hero.power);
                scoreView.enterframe(game.score, game.hero, stage.bossPower());
            }

        };
    };

    var onload = function(startButton, slowStartButton) {
        return function() {
            var stage = new Stage();
            enchant();
            enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];// keybindの解除
            var game = new Game(320, 240);
            game.preload([Hero.IMG, Shot.IMG]);
            game.preload(stage.getImages());
            game.start();
            game.score = new Score();
            var scoreView = new ScoreView();

            var getCode = function() { return codeArea.value };
            startButton.addEventListener("click", startGame(game, 30, getCode, stage, scoreView));
            slowStartButton.addEventListener("click", startGame(game, 10, getCode, stage, scoreView));

            game.addEventListener('load', function() { startButton.click(); });
            game.addEventListener('enterframe', enterframe(game, stage, scoreView));
        };
    };
    
    // tab accept
    document.querySelector("textarea").addEventListener("keydown", function(e) {
        if (e.keyCode === 9) {//tab
            e.preventDefault();
            var elem = e.target;
            var val = elem.value;
            var pos = elem.selectionStart;
            elem.value = val.substr(0, pos) + '\t' + val.substr(pos, val.length);
            elem.setSelectionRange(pos + 1, pos + 1);
        }
        
    });

    window.onload = onload(startButton, slowStartButton);

})();

var program = function(code, step, pos, userData) {
    var NONE = 0;
    var SHORT_JUMP = 16;
    var LONG_JUMP = 28;
    var LEFT = -1;
    var RIGHT = 1;
    eval('var func = ' + code + ';');
    return func(step, pos, userData);
};