var Physics = (function () {
    function Physics() {
        this.a = Physics.dim(0, 0);
        this.v = Physics.dim(0, 0);
        this.p = Physics.dim(0, 0);
    }

    Physics.dim = function(x, y) {
        return {'x': x, 'y': y};
    }

    Physics.plus = function(dimA, dimB) {
        return {'x': dimA.x + dimB.x, 'y': dimA.y + dimB.y};
    }
    
    Physics.prototype.step = function() {
        this.v = Physics.plus(this.v, this.a);
        this.p = Physics.plus(this.p, this.v);
    }

    return Physics;
})();