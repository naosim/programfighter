var Hero = (function () {
    function Hero(game, code, controlProgram) {
        this.power = Hero.MAX_POWER;
        this.game = game;
        this.lastShotAge = 0;
        this.orientation = 1;
        this.isDead = false;
        this.state = new HeroNomalState(this);
        this.code = code;
        this.controlProgram = controlProgram;
        this.userData = {};

        var sprite = new Sprite(32, 32);
        this.sprite = sprite;
        sprite.image = game.assets[Hero.IMG];
        sprite.physics = new Physics();
        var _this = this;
        sprite.addEventListener('enterframe', function() {
            _this.state.enterframe();
        });
    }
    
    Hero.prototype.normalEnterframe = function() {
        var sprite = this.sprite;
        var game = this.game;

        var hitSprite = this.getHitSprite();
        if(hitSprite) {
            this.state.hit(hitSprite);
            return;
        }

        try {
            var heroPos = {"x":game.hero.sprite.x, "y":game.hero.sprite.y};
            var data = this.controlProgram(this.code, sprite.age, heroPos, this.userData);
            data.arrow = parseInt(Math.min(Math.max(-1, data.arrow), 1), 10); // -1, 0, 1;
            data.jump = Math.max(0, Math.min(data.jump, 32));
        }catch(e) {
            alert("error: " + e);
            game.pause();
            return;
        }

        sprite.physics.v.x = data.arrow * Hero.VX;
        this.orientation = data.arrow;
        sprite.frame = 0;
        
        if(data.shot && game.shotLayer.childNodes.length <= 3 && sprite.age - this.lastShotAge > 4) {
            this.lastShotAge = sprite.age;
            var shot = new Shot(game, sprite.x + sprite.width / 2, sprite.y + sprite.height / 2, this.orientation);
            game.shotLayer.addChild(shot.sprite);
        }
        
        this.stepPhysics();
        
        if(sprite.physics.p.y == game.height - sprite.height && data.jump) {
            sprite.physics.v.y -= data.jump;
        }
        sprite.x = Math.floor(sprite.physics.p.x);
        sprite.y = Math.floor(sprite.physics.p.y);
        sprite.scaleX = this.orientation;
        if(Math.abs(sprite.physics.v.x) > 0) {
            sprite.frame = [0, 0, 1, 1, 0, 0, 2, 2][sprite.age % 8];
        } else {
            sprite.frame = 0;
        }
    };

    Hero.prototype.stepPhysics = function() {
        this.sprite.physics.a = Physics.dim(0, 1.0 - this.sprite.physics.v.y * 0.1);
        this.sprite.physics.step();
        this.checkGround();
    }

    Hero.prototype.hit = function(hitSprite) {
        this.power -= 1;
        this.sprite.physics.v.x = -3;
        this.sprite.physics.v.y = -3;
    };

    Hero.prototype.hittingEnterframe = function() {
        this.sprite.frame = 3;
        this.stepPhysics();
        this.sprite.x = Math.floor(this.sprite.physics.p.x);
        this.sprite.y = Math.floor(this.sprite.physics.p.y);
    };
    
    Hero.prototype.dead = function() {
        this.isDead = true;
    }

    Hero.prototype.getHitSprite = function() {
        var sprite = this.sprite;

        if(sprite.intersect(this.game.boss.sprite)) return this.game.boss.sprite;

        var hitSprite = null;
        this.game.enemyShotLayer.childNodes.forEach(function(s) {
            if(sprite.intersect(s)) {
                hitSprite = s;
            }
        });
        return hitSprite;
    }


    Hero.prototype.checkGround = function() {
        this.checkLeft().checkRight().checkBottom();
    }
    Hero.prototype.checkBottom = function() {
        if(this.sprite.physics.p.y > this.game.height - this.sprite.height) {
            this.sprite.physics.v.y = 0;
            this.sprite.physics.p.y = this.game.height - this.sprite.height;
        }
        return this;
    };
    Hero.prototype.checkLeft = function() {
        if(this.sprite.physics.p.x < 0) this.sprite.physics.p.x = 0;
        return this;
    };
    Hero.prototype.checkRight = function() {
        if(this.sprite.physics.p.x > this.game.width - this.sprite.width) this.sprite.physics.p.x = this.game.width - this.sprite.width;
        return this;
    };


    Hero.IMG = 'img/images/chara1.png';
    Hero.VX = 2.0;
    Hero.MAX_POWER = 20;
    Hero.LONG_JUMP = 28.0;
    Hero.SHORT_JUMP = 16.0;
    return Hero;
})();