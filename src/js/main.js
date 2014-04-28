(function() {
    var showStatus = function(score, hero, boss) {
        wordsText.innerHTML = score.wordCount;
        timeText.innerHTML = score.timeScore;
        scoreText.innerHTML = score.score;
        
        var text = "";
        for(var i = 0; i < hero.power; i++) {
            text += "■";
        }
        heroPowerText.innerHTML = text;
        
        text = "";
        for(var i = 0; i < boss.power; i++) {
            text += "■";
        }
        
        bossPowerText.innerHTML = text;
        frameText.innerHTML = hero.sprite.age;
    }
    
    var startGame = function(game, fps) {
        return function() {
            var code = codeArea.value;
            var scene = new Scene();
            var hero = new Hero(game, code, program);
            var boss = new Boss(game);
            var shotLayer = new Group();
            var enemyShotLayer = new Group();
            game.fps = fps;
            game.hero = hero;
            game.boss = boss;
            game.shotLayer = shotLayer;
            game.enemyShotLayer = enemyShotLayer;
            
            scene.addChild(boss.sprite);
            scene.addChild(shotLayer);
            scene.addChild(enemyShotLayer);
            scene.addChild(hero.sprite);
            
            
            game.popScene();
            game.pushScene(scene);
            game.score.resetTime();
            game.score.setCode(code);
            game.resume();
        };
    };
    
    
    window.onload = function () {
        enchant();
        enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];// keybindの解除
        game = new Game(320, 240);
        game.preload([Hero.IMG, Shot.IMG]);
        game.start();
        game.score = new Score();

        startButton.addEventListener("click", startGame(game, 30));
        slowStartButton.addEventListener("click", startGame(game, 10));

        game.addEventListener('load', function() {
            // 開始
            startButton.click();
        });
        game.addEventListener('enterframe', function() {
            if(!game.hero || !game.boss) {
                
            }
            else if(game.hero.isDead) {
                showStatus(game.score, game.hero, game.boss);
                scoreText.innerHTML = "0";
                heroPowerText.innerHTML = "LOSE...";
                game.pause();
            }
            else if(game.boss.isDead) {
                showStatus(game.score, game.hero, game.boss);
                scoreText.innerHTML = game.score.score + " WIN!!";
                bossPowerText.innerHTML = "";
                game.pause();
            }
            else {
                game.score.enterframe(game.hero.power);
                showStatus(game.score, game.hero, game.boss);
            }
            
        });
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