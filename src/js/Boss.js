var Boss = (function () {
    function Boss(game) {
        this.power = Boss.MAX_POWER;
        this.isDead = false;
        this.orientation = -1;
        this.lastShotAge = 0;
        
        var sprite = new Sprite(32, 32);
        this.sprite = sprite;
        sprite.step = 0;
        sprite.image = game.assets[Hero.IMG];
        sprite.frame = 5;
        sprite.scaleX = -1;
        sprite.x = 240;
        sprite.y = game.height - sprite.height;
        var _this = this;
        sprite.addEventListener('enterframe', function() {
            var isHit = false;
            var hitSprite = null;
            game.shotLayer.childNodes.forEach(function(s) {
                if(sprite.intersect(s)) {
                    isHit = true;
                    hitSprite = s;
                }
            });
            if(isHit) {
                hitSprite.parentNode.removeChild(hitSprite);
                _this.power -= 1;
                if(_this.power <= 0) {
                    _this.isDead = true;
                }
            }
            
            if(sprite.age % 3 == 0 && game.enemyShotLayer.childNodes.length < 4) {
                _this.lastShotAge = sprite.age;
                var shot = new Shot(game, sprite.x, sprite.y + sprite.height / 2, _this.orientation, true);
                game.enemyShotLayer.addChild(shot.sprite);
            }
        });

    }
    Boss.MAX_POWER = 20;
    return Boss;
})();