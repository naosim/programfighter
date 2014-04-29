var ScoreView = (function () {
    function ScoreView() {
    }
    ScoreView.prototype.lose = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);
    };
    ScoreView.prototype.win = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);

        scoreBase.style['display'] = 'block';

        var countUp = function(max, elm) {
            var i = 0;
            return function() {
                var up = parseInt((max - i) / 3, 10);
                if(up != 0) {
                    i += up;
                } else {
                    i = max;
                }

                if(elm)elm.innerHTML = i;
                
                return up != 0;
            };
        };

        [powerScore, timeScore, codeScore, totalScore].forEach(function(e) {
            e.innerHTML = '';
        });

        new IntervalChain()
        .add(countUp(score.power, powerScore))
        (countUp(score.timeScore, timeScore))
        (countUp(score.wordCount, codeScore))
        (countUp(score.score, totalScore))();


    };
    ScoreView.prototype.enterframe = function(score, hero, bossPower){
        ScoreView.showStatus(score, hero, bossPower);
    };

    ScoreView.showStatus = function(score, hero, bossPower) {
        heroCell.style['width'] = Math.max(Math.floor(hero.power * 100 / Hero.MAX_POWER), 0.1) + '%';
        bossCell.style['width'] = Math.max(Math.floor(bossPower * 100 / Hero.MAX_POWER), 0.1) + '%';
        frameText.innerHTML = hero.sprite.age;
    };

    ScoreView.prototype.dismiss = function() {
        scoreBase.style['display'] = 'none';
    }

    return ScoreView;
})();