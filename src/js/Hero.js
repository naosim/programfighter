var Hero = (function () {
    function Hero(game, code, controlProgram) {
        this.power = Hero.MAX_POWER;
        this.lastShotAge = 0;
        this.isHitting = false;
        this.hitStartAge = 0;
        this.orientation = 1;
        this.isDead = false;
        this.code = code;
        this.controlProgram = controlProgram;
        this.userData = {};
        var sprite = new Sprite(32, 32);
        this.sprite = sprite;
        sprite.step = 0;
        sprite.image = game.assets[Hero.IMG];
        sprite.physics = new Physics();
        var _this = this;
        sprite.addEventListener('enterframe', function() {
            if(_this.isDead) return;
            
            if(!_this.isHitting) {
                _this.hitTest(game.boss.sprite);
                var isHit = false;
                var hitSprite = null;
                game.enemyShotLayer.childNodes.forEach(function(s) {
                    if(sprite.intersect(s)) {
                        isHit = true;
                        hitSprite = s;
                    }
                });
                if(isHit) {
                    _this.isHitting = true;
                    hitSprite.parentNode.removeChild(hitSprite);
                    _this.power -= 1;
                    if(_this.power <= 0) {
                        _this.isDead = true;
                    }
                    
                }
            }
            
            try {
                var heroPos = {"x":game.hero.sprite.x, "y":game.hero.sprite.y};
                var data = _this.controlProgram(_this.code, sprite.step, heroPos, _this.userData);
            }catch(e) {
                alert("hoge");
                game.pause();
                return;
            }
            if(data == -1) {
                
            }
            var vx = 0;
            if(!_this.isHitting) {
                if(data.arrow > 0) {
                    vx = Hero.VX;
                    _this.orientation = 1;
                } else if(data.arrow < 0) {
                    vx = -Hero.VX;
                    _this.orientation = -1;
                }
                sprite.physics.v.x = vx;
                sprite.frame = 0;
                
                if(data.shot && game.shotLayer.childNodes.length <= 3 && sprite.age - _this.lastShotAge > 4) {
                    _this.lastShotAge = sprite.age;
                    var shot = new Shot(game, sprite.x + sprite.width / 2, sprite.y + sprite.height / 2, _this.orientation);
                    game.shotLayer.addChild(shot.sprite);
                }
                
                
            } else {
                sprite.frame = 3;
                if(sprite.age - _this.hitStartAge > 10) {
                    _this.isHitting = false;
                }
            }
            
            sprite.physics.a = Physics.dim(0, 1.0 - sprite.physics.v.y * 0.1);
            
            sprite.physics.step();
            if(sprite.physics.p.y > game.height - sprite.height) {
                sprite.physics.v.y = 0;
                sprite.physics.p.y = game.height - sprite.height;
            }
            if(sprite.physics.p.x < 0) {
                sprite.physics.p.x = 0;
            } else if(sprite.physics.p.x > game.width - sprite.width) {
                sprite.physics.p.x = game.width - sprite.width;
            }
            
            if(sprite.physics.p.y == game.height - sprite.height && data.jump) {
                // sprite.physics.v.y -= (data.jump == 1 ? Hero.SHORT_JUMP : Hero.LONG_JUMP);
                sprite.physics.v.y -= Math.max(0, Math.min(data.jump, 32));
            }
            
            
            sprite.x = Math.floor(sprite.physics.p.x);
            sprite.y = Math.floor(sprite.physics.p.y);
            sprite.scaleX = _this.orientation;
            if(Math.abs(sprite.physics.v.x) > 0) {
                sprite.frame = [0, 0, 1, 1, 0, 0, 2, 2][sprite.age % 8];
            } else {
                sprite.frame = 0;
            }
            
            
            sprite.step++;
        });
    }
    
    Hero.prototype.hitTest = function(sprite) {
        if(!this.isHitting) {
            if(this.sprite.intersect(sprite)) {
                this.isHitting = true;
                this.hitStartAge = this.sprite.age;
                this.sprite.physics.v.x = -3;
                this.sprite.physics.v.y = -3;
                this.power -= 1;
                if(this.power <= 0) {
                    this.isDead = true;
                }
            }
        }
    }
    
    Hero.IMG = 'img/images/chara1.png';
    Hero.VX = 2.0;
    Hero.MAX_POWER = 20;
    Hero.LONG_JUMP = 28.0;
    Hero.SHORT_JUMP = 16.0;
    return Hero;
})();