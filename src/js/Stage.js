var Stage = (function () {
    function Stage(){};

    /// 画像ファイル名のリストを取得する
    Stage.prototype.getImages = function() {
        return [];
    };

    /// ステージをセットアプする
    Stage.prototype.setup = function(game, scene) {
        var boss = new Boss(game);
        this.game = game;
        this.boss = boss;
        scene.addChild(boss.sprite);
    };

    // 主人公が勝ったらtrue, 負けたらfalseを返す
    Stage.prototype.isWin = function() { return this.boss.isDead; };
    // ボスの残パワーを返す
    Stage.prototype.bossPower = function() { return this.boss.power; };
    // 位置の補正(壁に当たっているときなど)
    Stage.prototype.fixHeroPosition = function(hero) {
        if(hero.sprite.physics.p.y > this.game.height - hero.sprite.height) {
            hero.sprite.physics.v.y = 0;
            hero.sprite.physics.p.y = this.game.height - hero.sprite.height;
        }
        if(hero.sprite.physics.p.x < 0) {
            hero.sprite.physics.p.x = 0;
        } else if(hero.sprite.physics.p.x > this.game.width - hero.sprite.width) {
            hero.sprite.physics.p.x = this.game.width - hero.sprite.width;
        }
    }

    /// 主人公がジャンプ可能かどうかを返す
    Stage.prototype.jumpableHero = function(hero) {
        return hero.sprite.physics.p.y >= this.game.height - hero.sprite.height;
    }

    return Stage;
})();