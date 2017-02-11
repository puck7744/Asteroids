function Rock(size, x, y, dx, dy) {
    if (typeof(size) != 'number' || size <= 0) throw "Invalid size paramater passed to Rock";
    if (typeof(x) != 'number' || typeof(y) != 'number' || typeof(dx) != 'number' || typeof(dy) != 'number') throw "Invalid locational parameter passed to Rock";

    this.size = size;
    this.points = this.generate(size);
    this.x = x || 0;
    this.y = y || 0;
    this.dx = dx || 0; //x and y velocity
    this.dy = dy || 0;
    this.r = 0; //Rotation in radians
    this.dr = Math.random()/4-0.125; //Rotation speed in radians per tick
    Rock.list.push(this);
}

Rock.list = new Array();

Rock.destroyAll = function() {
    delete Rock.list;
    Rock.list = new Array();
}

Rock.prototype.generate = function(size) {
    var result = [];
    var sides = 7+Math.round(Math.random()*2);
    var rStep = Math.PI*2/sides;
    var variation;
    for (var i = 0; i < sides; i++) {
        variation = 1.0+(Math.random()/2-0.25);
        result.push({angle: rStep*i, length: size*variation});
    }
    return result;
}

Rock.prototype.tick = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.r += this.dr;
}

Rock.prototype.destroy = function() {
    Rock.list.splice(Rock.list.indexOf(this), 1);
}

Rock.prototype.getPath = function(scale, offsetx, offsety) {
    scale = scale || 1;
    offsetx = offsetx || 0;
    offsety = offsety || 0;

    var path = "";
    for (var i = 0; i < this.points.length; i++) {
        path += (i == 0 ? "M" : "L")+String(offsetx+this.x+Math.sin(this.points[i].angle+this.r)*(this.points[i].length*scale))+","+String(offsety+this.y-Math.cos(this.points[i].angle+this.r)*(this.points[i].length*scale));
    }
    return path+"Z";
}
