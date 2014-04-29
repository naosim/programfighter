
var IntervalChain = (function() {
    function IntervalChain(prev) {
        this.prev = prev;
    }

    IntervalChain.prototype.add = function(action, intervalTime) {
        if(!action) {
            this.start();
            return;
        }

        this.action = action;
        this.intervalTime = intervalTime || 100;
        this.next = new IntervalChain(this);
        return this.next.add.bind(this.next);
    }

    IntervalChain.prototype.start = function() {
        if(this.prev) {
            this.prev.start();
            return;
        }

        if(!this.action) return;

        var _this = this;
        var timer = setInterval(function() {
            if(!_this.action()) {
                clearInterval(timer);
                if(_this.next) {
                    _this.next.prev = null;
                    _this.next.start();
                }
            }
        }, this.intervalTime);
    }

    return IntervalChain;
})();