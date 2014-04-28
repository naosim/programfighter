var Score = (function () {
    function Score() {
        this.startTime = -1;
        this.timeScore = 0;
        this.wordCount = 0;
        this.score = 0;
        this.power = Hero.MAX_POWER;
    }
    Score.prototype.resetTime = function() {
        this.startTime = new Date().getTime();
    };
    Score.prototype.setCode = function(code) {
        this.wordCount = countWords(code);
    };
    Score.prototype.enterframe = function(power) {
        if(this.startTime < 0) return;
        this.timeScore = Math.floor((30 - Math.floor((new Date().getTime() - this.startTime)/1000)) * 100 / 30);
        this.power = Math.floor(power * 99 / Hero.MAX_POWER);
        this.score = this.power * 100 + this.timeScore - this.wordCount;
    };
    
    var replaceAll = function(expression, org, dest){  
        return expression.split(org).join(dest);  
    }
    var countWords = function(s){
        s = s.replace(/(^\s*)|(\s*$)/gi,"");
        s = s.replace(/[ ]{2,}/gi," ");
        s = s.replace(/\n /," ");
        var rep = '{}();:+-*/%&|<>?!"\'';
        for(var i = 0; i < rep.length; i++) {
            s = replaceAll(s, rep.charAt(i)," ");
        }
        s = replaceAll(s, "  "," ");
        return s.trim().split(' ').length;
    }
    return Score;
})();