function Ship(x, y, r) {
    this.x = x || 0;
    this.y = y || 0;
    this.dx = this.dy = 0;
    this.r = r || 0;
    this.points = [
        {a: "M", x: -35, y:  50},
        {a: "L", x:   0, y: -50},
        {a: "L", x:  35, y:  50},
        {a: "M", x: -30, y:  35},
        {a: "L", x:  30, y:  35}
    ];
    this.nosePos = {x: 0, y: -50};
    this.control = Ship.controls.STOP;
    this.weaponCooldown = 0;
}

Ship.bulletSpeed = 12;
Ship.rateOfFire = 2;

Ship.controls = {
    STOP: 0,
    LEFT: 1,
    RIGHT: 2,
    FORWARD: 4,
    FIRE: 8
};

Ship.prototype.turnLeft = function(on) {
    if (on) this.control |= Ship.controls.LEFT;
    else this.control &= ~Ship.controls.LEFT;
}

Ship.prototype.turnRight = function(on) {
    if (on) this.control |= Ship.controls.RIGHT;
    else this.control &= ~Ship.controls.RIGHT;
}

Ship.prototype.thrust = function(on) {
    if (on) this.control |= Ship.controls.FORWARD;
    else this.control &= ~Ship.controls.FORWARD;
}

Ship.prototype.fire = function(on) {
    if (on) this.control |= Ship.controls.FIRE;
    else this.control &= ~Ship.controls.FIRE;
}

Ship.prototype.tick = function() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.control & Ship.controls.LEFT) this.r -= 0.1;
    if (this.control & Ship.controls.RIGHT) this.r += 0.1;
    if (this.control & Ship.controls.FORWARD) {
        this.dx += Math.sin(this.r)*0.1;
        this.dy += -Math.cos(this.r)*0.1;
    }

    if (this.weaponCooldown) this.weaponCooldown--;
    if (this.control & Ship.controls.FIRE && this.weaponCooldown == 0) {
        //Create a bullet at the tip of the nose with the default velocity toward the ship's orientation
        new Bullet(
            this.nosePos.x, //x
            this.nosePos.y, //y
            Math.sin(this.r)*Ship.bulletSpeed, //dx
            -Math.cos(this.r)*Ship.bulletSpeed //dy
        );
        this.weaponCooldown = Math.round(1000/Ship.rateOfFire/33.333);
    }
}

Ship.prototype.getPath = function(scale) {
    scale = scale || 1;
    var path = "";
    var points = this.points.slice(0);

    // Show thrusters based on input
    if (this.control & Ship.controls.LEFT) points.push.apply(points, [{a: "M", x: 0, y: -50}, {a: "L", x: 10, y: -45}, {a: "L", x: 5, y: -40}]);
    if (this.control & Ship.controls.RIGHT) points.push.apply(points, [{a: "M", x: 0, y: -50}, {a: "L", x: -10, y: -45}, {a: "L", x: -5, y: -40}]);
    if (this.control & Ship.controls.FORWARD) points.push.apply(points, [{a: "M", x: -25, y: 35}, {a: "L", x: -15, y: 50}, {a: "L", x: -5, y: 35}, {a: "M", x: 5, y: 35}, {a: "L", x: 15, y: 50}, {a: "L", x: 25,y: 35}]);

    // Rotation
    for (var i = 0; i < points.length; i++) {
        var x = this.x+((points[i].x*scale)*Math.cos(this.r)-(points[i].y*scale)*Math.sin(this.r));
        var y = this.y+((points[i].y*scale)*Math.cos(this.r)+(points[i].x*scale)*Math.sin(this.r));
        if (i == 1) this.nosePos = {x: x, y: y};
        path += points[i].a+String(x)+","+String(y);
    }

    return path;
}
