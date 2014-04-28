var ScoreView = (function () {
    function ScoreView() {
    }
    ScoreView.prototype.lose = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);
        scoreText.innerHTML = "0";
        heroPowerText.innerHTML = "LOSE...";
    };
    ScoreView.prototype.win = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);
        scoreText.innerHTML = score.score + " WIN!!";
        bossPowerText.innerHTML = "";

    };
    ScoreView.prototype.enterframe = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);
    };

    ScoreView.showStatus = function(score, hero, bossPower) {
        wordsText.innerHTML = score.wordCount;
        timeText.innerHTML = score.timeScore;
        scoreText.innerHTML = score.score;
        
        var text = "";
        for(var i = 0; i < hero.power; i++) {
            text += "■";
        }
        heroPowerText.innerHTML = text;
        
        text = "";
        for(var i = 0; i < bossPower; i++) {
            text += "■";
        }
        
        bossPowerText.innerHTML = text;
        frameText.innerHTML = hero.sprite.age;
    };

    return ScoreView;
})();