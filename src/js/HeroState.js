/*
hero.normalEnterframe()
hero.hittingEnterframe()
*/

var HeroState = (function () {
    function HeroState(hero) {
        this.hero = hero;
        if(hero.state) hero.state.exit();
        this.hero.state = this;
        this.entry();
    }
    HeroState.prototype.hit = function(sprite){};
    HeroState.prototype.comeback = function(){};
    HeroState.prototype.dead = function(){};
    HeroState.prototype.enterframe = function(){};
    HeroState.prototype.entry = function(){};
    HeroState.prototype.exit = function(){};
    return HeroState;
})();

var HeroNomalState = (function (_super) {
    __extends(HeroNomalState, _super);
    function HeroNomalState(hero) {
        _super.call(this, hero);
    }
    HeroNomalState.prototype.hit = function (sprite) {
        _super.prototype.hit.call(this, sprite);
        this.hero.hit(sprite);
        new HittingState(this.hero);
    };
    HeroNomalState.prototype.enterframe = function(){
        this.hero.normalEnterframe();
    };
    return HeroNomalState;
})(HeroState);

var HittingState = (function (_super) {
    __extends(HittingState, _super);
    function HittingState(hero) {
        _super.call(this, hero);
        this.step = 0;
    }
    HittingState.prototype.comeback = function () {
        _super.prototype.comeback.call(this);
        new HeroNomalState(this.hero);
    };
    HittingState.prototype.dead = function () {
        _super.prototype.dead.call(this);
        new DeadState(this.hero);
    };
    HittingState.prototype.enterframe = function(){
        if(this.step > 10) {
            this.comeback();
        } else {
            this.hero.hittingEnterframe();
        }
        this.step++;
    };
    HittingState.prototype.entry = function(){
        if(this.hero.power <= 0) new DeadState(this.hero);
    };
    return HittingState;
})(HeroState);

var DeadState = (function (_super) {
    __extends(DeadState, _super);
    function DeadState(hero) {
        _super.call(this, hero);
    }
    DeadState.prototype.entry = function () {
        _super.prototype.entry.call(this);
        this.hero.dead();
    };
    return DeadState;
})(HeroState);