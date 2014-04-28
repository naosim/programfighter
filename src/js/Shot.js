var Shot = (function () {
    function Shot(game, x, y, orientation, isEnemy) {
        var sprite = new Sprite(16, 16);
        this.sprite = sprite;
        sprite.image = game.assets[Shot.IMG];
        sprite.frame = isEnemy ? 45 : 46;
        sprite.x = x;
        sprite.y = y;
        sprite.addEventListener('enterframe', function() {
            if(sprite.x < 0 || sprite.x > game.width) {
                sprite.parentNode.removeChild(sprite);
            }
            
            
            sprite.x += 6 * orientation;
        });
    }
    Shot.IMG = "img/images/icon0.png";
    return Shot;
})();