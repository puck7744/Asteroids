Game = function() {
    this.state = Game.states.UNINITIALIZED;
    this.title = this.paused = null;
    this.ship = null;
}

Game.states = {
    UNINITIALIZED: 0,
    READY: 1,
    MENU: 2,
    PLAY: 3,
    PAUSE: 4
};

Game.prototype.windowResize = function() {
    var px2percent = $(window).height()/100;
    $.each([this.title, this.paused], function(i, element) {
        element.children('h1').css('font-size', (25*px2percent)+'px');
        element.children('p').css('font-size', (7*px2percent)+'px');
    });
    this.paper.setSize($(window).width(), $(window).height());
}

Game.prototype.keyPress = function(event) {
    event.keyCode = event.keyCode || event.which;
    switch (event.keyCode) {
        case 27:
            this.menu();
            event.preventDefault();
        break;
        case 112:
            this.pause();
            event.preventDefault();
        break;
    }
}

Game.prototype.keyDown = function(event) {
    event.keyCode = event.keyCode || event.which;
    switch (event.keyCode) {
        case 37: //Left
        case 97: //a
        case 65: //A
            this.ship.turnLeft(true);
            event.preventDefault();
        break;
        case 39: //Right
        case 100://d
        case 68: //D
            this.ship.turnRight(true);
            event.preventDefault();
        break;
        case 38: //Up
        case 119://w
        case 87: //W
            this.ship.thrust(true);
            event.preventDefault();
        break;
        case 32: //Space
            this.ship.fire(true);
            event.preventDefault();
        break;
    }
}

Game.prototype.keyUp = function(event) {
    event.keyCode = event.keyCode || event.which;
    switch (event.keyCode) {
        case 37: //Left
        case 97: //a
        case 65: //A
            this.ship.turnLeft(false);
            event.preventDefault();
        break;
        case 39: //Right
        case 100://d
        case 68: //D
            this.ship.turnRight(false);
            event.preventDefault();
        break;
        case 38: //Up
        case 119://w
        case 87: //W
            this.ship.thrust(false);
            event.preventDefault();
        break;
        case 32: //Space
            this.ship.fire(false);
            event.preventDefault();
        break;
    }
}

Game.prototype.initialize = function() {
    this.paper = Raphael(0, 0, $(window).width(), $(window).height());

    this.title = $('<div id="title"><h1>Space Rocks</h1><p>Click anywhere to play</p></div>');
    this.paused = $('<div id="paused"><h1>Paused</h1><p>Press P to resume</p></div>');
    $.each([this.title, this.paused], function(i, element) { element.appendTo('body') });

    this.title.click(this.run.bind(this));

    $(window).keypress(this.keyPress.bind(this));
    $(window).keydown(this.keyDown.bind(this));
    $(window).keyup(this.keyUp.bind(this));

    $(window).resize(this.windowResize.bind(this));
    $(window).resize();

    this.interval = setInterval(this.tick.bind(this), 33);

    this.state = Game.states.READY;
}

Game.prototype.menu = function() {
    if (this.state == Game.states.UNINITIALIZED) this.initialize();

    switch (this.state) {
        case Game.states.MENU: return;
        case Game.states.READY:
        case Game.states.PLAY:
        case Game.states.PAUSE:
            //Return to menu
            delete this.ship;
            this.generateRocks(true);
            this.title.show();
            this.state = Game.states.MENU;
        break;
    }
}

Game.prototype.run = function() {
    if (this.state == Game.states.UNINITIALIZED) this.initialize();

    // Check previous state
    switch (this.state) {
        case Game.states.READY:
        case Game.states.MENU:
            // Game just started
            this.title.hide();
            this.generateRocks();
            this.ship = new Ship($(window).width()/2, $(window).height()/2, 1.5);
            this.state = Game.states.PLAY;
        break;
        case Game.states.PLAY:
        case Game.states.PAUSE:
            this.paused.hide();
            this.state = Game.states.PLAY;
        break;
    }
}

Game.prototype.pause = function() {
    if (this.state == Game.states.UNINITIALIZED) return;
    switch (this.state) {
        case Game.states.READY:
        case Game.states.MENU:
        break;
        case Game.states.PAUSE:
            this.run();
        break;
        case Game.states.PLAY:
            this.paused.show();
            this.state = Game.states.PAUSE;
        break;
    }
}

Game.prototype.generateRocks = function(menuType) {
    Rock.destroyAll();
    
    for (var n = 0; n < 7; n++) {
        if (menuType) {
            size = 20+Math.random()*80;
            new Rock(
                size, //size
                Math.random()*$(window).width(), //x
                Math.random()*$(window).height(), //y
                Math.random()*((110-size)/5)-((110-size)/10), //dx
                Math.random()*((110-size)/5)-((110-size)/10)  //dy
            );
        }
        else {
            /*
             * Give the ship some initial breathing room by limiting positions
             * to the outer quarter of the screen
             */
            var pos = {
                x: Math.random()*$(window).width()/4,
                y: Math.random()*$(window).height()/4
            };
            if (Math.round(Math.random())) pos.x = $(window).width()-pos.x;
            if (Math.round(Math.random())) pos.y = $(window).width()-pos.y;

            new Rock(
                100, //size
                pos.x, //x
                pos.y, //y
                Math.random()*2-1, //dx
                Math.random()*2-1 //dy
            );
        }
    }
}

Game.prototype.tick = function() {
    if (this.state == Game.states.PAUSE) return;

    var scaleFactor = $(window).width()*$(window).height()/1000000; //Megapixels, effectively
    var objStyle = {
        //'stroke': col,
        'stroke': 'white',
        'stroke-width': String(scaleFactor*4)
    };

    // Clear canvas
    this.paper.clear();

    // Ship
    if (this.state == Game.states.PLAY) {
        // Update
        this.ship.tick();

        // Wrap
        while (this.ship.x < 0) this.ship.x += $(window).width();
        while (this.ship.x > $(window).width()) this.ship.x -= $(window).width();
        while (this.ship.y < 0) this.ship.y += $(window).height();
        while (this.ship.y > $(window).height()) this.ship.y -= $(window).height();

        // Collide

        // Draw
        this.paper.path(this.ship.getPath(scaleFactor)).attr(objStyle);
    }

    //Rocks
    for (var i = 0; i < Rock.list.length; i++) {
        // Update
        Rock.list[i].tick();

        //Wrap
        while (Rock.list[i].x < 0) Rock.list[i].x += $(window).width();
        while (Rock.list[i].x > $(window).width()) Rock.list[i].x -= $(window).width();
        while (Rock.list[i].y < 0) Rock.list[i].y += $(window).height();
        while (Rock.list[i].y > $(window).height()) Rock.list[i].y -= $(window).height();

        //Draw
        Rock.list[i].element = this.paper.path(Rock.list[i].getPath(scaleFactor)).attr(objStyle);

        //Collide

        /*
         * Perform smooth wrapping around the playfield by drawing multiple
         * copies of the rock if it's overlapping the window edge
         */
        /*
         * Disabled this because it was visually confusing and not true to
         * the retro feel
         */
        /*if (Rock.list[i].x-Rock.list[i].size < 0) this.paper.path(Rock.list[i].getPath($(window).width())).attr(objStyle);
        if (Rock.list[i].x+Rock.list[i].size > $(window).width()) this.paper.path(Rock.list[i].getPath(-$(window).width())).attr(objStyle);
        if (Rock.list[i].y-Rock.list[i].size < 0) this.paper.path(Rock.list[i].getPath(0, $(window).height())).attr(objStyle);
        if (Rock.list[i].y+Rock.list[i].size > $(window).height()) this.paper.path(Rock.list[i].getPath(0, -$(window).height())).attr(objStyle);*/
    }

    //Bullets
    for (var i = 0; i < Bullet.list.length; i++) {
        //Update
        Bullet.list[i].tick();

        if (!Bullet.list[i].life) {
            Bullet.list[i--].destroy();
            continue;
        }

        //Wrap
        while (Bullet.list[i].x < 0) Bullet.list[i].x += $(window).width();
        while (Bullet.list[i].x > $(window).width()) Bullet.list[i].x -= $(window).width();
        while (Bullet.list[i].y < 0) Bullet.list[i].y += $(window).height();
        while (Bullet.list[i].y > $(window).height()) Bullet.list[i].y -= $(window).height();

        //Collide
        for (var n = 0; n < Rock.list.length; n++) {
            // TODO: Broad phase with AABB? Does isPointInside already do this?
            if (Rock.list[n].element.isPointInside(Bullet.list[i].x, Bullet.list[i].y)) {
                if (Rock.list[n].size > 25) for (var x = 0; x < 2; x++) {
                    size = Rock.list[n].size/2;
                    new Rock(size, Rock.list[n].x, Rock.list[n].y, Math.random()*((110-size)/5)-((110-size)/10), Math.random()*((110-size)/5)-((110-size)/10));
                }
                Rock.list[n--].destroy();
                Bullet.list[i--].destroy();
            }
        }

        //Draw
        this.paper.path(Bullet.list[i].getPath(scaleFactor)).attr(objStyle);
    }
}
