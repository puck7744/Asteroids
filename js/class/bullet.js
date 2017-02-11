function Bullet(x, y, dx, dy) {
    this.x = x || 0;
    this.y = y || 0;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.life = Bullet.lifetime;
    Bullet.list.push(this);
}

Bullet.list = new Array();

Bullet.lifetime = 90; // 3 Seconds

Bullet.destroyAll = function() {
    delete Bullet.list;
    Bullet.list = new Array();
}

Bullet.prototype.tick = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.life--;
}

Bullet.prototype.destroy = function() {
    Bullet.list.splice(Bullet.list.indexOf(this), 1);
}

Bullet.prototype.getPath = function(scale) {
    return "M"+String(this.x)+","+String(this.y)+"L"+String(this.x-this.dx)+","+String(this.y-this.dy);
}
