(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Console = require('../lib/console'),
	con,
	example,
    randomColors = [],
    canvas,
    customColors = false,
    colorSource = document.getElementById('rcc_color');

// pregenerate 2000 random RGB colors
con = 2000;
while (con--) {
    randomColors.push('rgb(' + ((Math.random() * 256) >> 0) + ',' + ((Math.random() * 256) >> 0) + ',' + ((Math.random() * 256) >> 0) + ')')
}

example = function(){
	var l = 2000;


	// draw random characters to console
	if (customColors) while(l--) con.draw(((Math.random() * con.width) >> 0), ((Math.random() * con.height) >> 0), {
		c: ((Math.random() * 17) >> 0),
		f: randomColors[((Math.random() * 2000) >> 0)],
		b: randomColors[((Math.random() * 2000) >> 0)]
	});
    else while(l--) con.draw(((Math.random() * con.width) >> 0), ((Math.random() * con.height) >> 0), {
        c: ((Math.random() * 17) >> 0),
        f: ((Math.random() * 21) >> 0),
        b: ((Math.random() * 21) >> 0)
    });
};

canvas = document.getElementById('rcc_canvas');
canvas.width = canvas.parentNode.clientWidth;
canvas.height = canvas.width * 0.75 >> 0;
canvas.addEventListener('click', function() {
    customColors = !customColors;
    colorSource.innerHTML = customColors ? 'random' : 'prerendered';
});

con = new Console({
	canvas: canvas,
	fullscreen: false,
	sprites: {
		src: './img/rcc/sprites20.png',
		count: 16,
		width: 20,
		height: 20
	},
	colors: [
        /* grayscale dark  */
        '#000000', // 0 - black
        '#333333', // 1
        '#666666', // 2
        /* grayscale light */
        '#999999', // 3
        '#cccccc', // 4
        '#ffffff', // 5
        /* red/orange      */
        '#b21f35', // 6
        '#d82735', // 7
        '#ff7435', // 8
        /* orange/yellow   */
        '#ffa135', // 9
        '#ffcb35', // 10
        '#fff735', // 11
        /* green           */
        '#00753a', // 12
        '#009e47', // 13
        '#16dd36', // 14
        /* blue            */
        '#0052a5', // 15
        '#0079e7', // 16
        '#06a9fc', // 17
        /* purple          */
        '#681e7e', // 18
        '#7d3cb5', // 19
        '#bd7af6'  // 20
    ],
	onReady: function() {
		setInterval(example, 1000/25);
        con.clear('#fff');
	}
});
},{"../lib/console":2}],2:[function(require,module,exports){
"use strict";
/**
 * @class Console
 * @param {Object} init
 * @example
 *     new Console({
 *         canvas: document.createElement('canvas'),
 *         fullscreen: true,
 *         sprites: {
 *             src: './img/sprites20.png',
 *             count: 256,
 *             width: 20,
 *             height: 20
 *         },
 *         colors: [
 *             '#000000', // 0
 *             '#333333', // 1
 *             '#666666', // 2
 *             '#999999', // 3
 *             '#cccccc', // 4
 *             '#ffffff', // 5
 *             '#b21f35', // 6
 *             '#d82735', // 7
 *             '#ff7435', // 8
 *             '#ffa135', // 9
 *             '#ffcb35', // 10
 *             '#fff735', // 11
 *             '#00753a', // 12
 *             '#009e47', // 13
 *             '#16dd36', // 14
 *             '#0052a5', // 15
 *             '#0079e7', // 16
 *             '#06a9fc', // 17
 *             '#681e7e', // 18
 *              '#7d3cb5', // 19
 *              '#bd7af6'  // 20
 *          ]
 *     });
 */
var Console = function(init) {
    init = init || {};
    init.sprites = init.sprites || {
        src: './img/sprites20.png',
        count: 256,
        width: 20,
        height: 20
    };
    init.colors = init.colors || [
        /* grayscale dark  */
        '#000000', // 0 - black
        '#333333', // 1
        '#666666', // 2
        /* grayscale light */
        '#999999', // 3
        '#cccccc', // 4
        '#ffffff', // 5
        /* red/orange      */
        '#b21f35', // 6
        '#d82735', // 7
        '#ff7435', // 8
        /* orange/yellow   */
        '#ffa135', // 9
        '#ffcb35', // 10
        '#fff735', // 11
        /* green           */
        '#00753a', // 12
        '#009e47', // 13
        '#16dd36', // 14
        /* blue            */
        '#0052a5', // 15
        '#0079e7', // 16
        '#06a9fc', // 17
        /* purple          */
        '#681e7e', // 18
        '#7d3cb5', // 19
        '#bd7af6'  // 20
    ];
    this.isActive = false;
    this.nextRender = null;
    this.instant = null;

    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.createTiles = this.createTiles.bind(this);

    // callback
	this.ready = init.onReady;

    /**
     * @property {HTMLElement} canvas DOM reference to canvas element
     */
	this.canvas = init.canvas || document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");

    // tile redraw queue
    this.queue = [];
    this.tiles = [];

    /**
     * default tile drawn to console to fill tiles
     * @property {Object} base
     * @default { c: 0, f: '#fff', b: '#000' }
     */
    this.base = init.fill || { c: 0, f: '#fff', b: '#000' };

    /**
     * make console fullscreen
     * @property {Boolean} isFullscreen
     * @default true
     */
    this.isFullscreen = init.fullscreen || false;
    this.resizing = false;

    /**
     * console width in tiles
     * @property {Number} width
     */
    this.width = null;
    /**
     * console height in tiles
     * @property {Number} height
     */
    this.height = null;
    this.getDims();
    if (this.isFullscreen) window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
    /**
     * prerendered sprites colors, can be referred to by index for efficiency
     * @property {Array} [colors]
     * @default ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff', '#b21f35', '#d82735', '#ff7435', '#ffa135', '#ffcb35', '#fff735', '#00753a', '#009e47', '#16dd36', '#0052a5', '#0079e7', '#06a9fc', '#681e7e', '#7d3cb5', '#bd7af6' ]
     */
    this.colors = init.colors;
    this.colors.add = function(v, i, c) {
        c.palette[v] = i;
    };
    this.colors.palette = {};
    this.colors.forEach(this.colors.add);

    // sprite sheet creation
    init.sprites.onload = (function(canvas, ctx){
        this.sprites = canvas;
        this.custom = ctx;
    }).bind(this);
    this.sheet = new (require('./sprites'))(init.sprites, this.colors);
    /**
     * sprite widths in pixels
     * @property {Number} tileWidth
     */
    this.tileWidth = init.sprites.width;
    /**
     * sprite heights in pixels
     * @property {Number} tileHeight
     */
    this.tileHeight = init.sprites.height;
};
/**
 * convenience method for window.requestAnimationFrame
 * @method rAF
 */
Console.prototype.rAF = window.requestAnimationFrame.bind(window);
/**
 * convenience method for window.cancelAnimationFrame
 * @method cAF
 */
Console.prototype.cAF = window.cancelAnimationFrame.bind(window);

/**
 * clear console to color provided (will change letterboxing color if applicable console has any margins)
 * @method clear
 * @param  {string} rgba string hex of color to clear to
 */
Console.prototype.clear = function(rgba) {
	rgba = rgba || "#000";

	this.ctx.fillStyle = rgba;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'source-over';
};

/**
 * replace a single tile at coords
 * @method draw
 * @param  {Number} x x-coord of tile
 * @param  {Number} y y-coord of tile
 * @param  {Object} t tile containing only non-coordinate data
 *     @param  {Number} t.c index of sprite to draw
 *     @param  {String|Number} t.f color to paint sprite foreground
 *     @param  {String|Number} t.b color to paint sprite background
 */
Console.prototype.draw = function(x, y, t) {
    this.instant = this.tiles[x][y];

	this.instant.c = t.c || this.instant.c;
    this.instant.f = this.colors.palette[t.f] || t.f || this.instant.f;
    this.instant.b = this.colors.palette[t.b] || t.b || this.instant.b;

    this.instant.F.forecustom = (this.instant.f.charAt) ? true : false;
    this.instant.F.backcustom = (this.instant.b.charAt) ? true : false;

    // flag for redraw if necessary
    if (this.queue.indexOf(this.instant) === -1) this.queue.push(this.tiles[x][y]);
};

/**
 * force console to redraw every tile
 * @method forceRedraw
 */
Console.prototype.forceRedraw = function() {
    var x = this.width,
        y;
    while (x--) {
        y = this.height;
        while (y--) {
            this.draw(x, y, this.tiles[x][y]);
        }
    }
};

/**
 * redraw array of tiles
 * @method paint
 * @param  {Array} m tiles to redraw *see Console.draw() for tile params
 */
Console.prototype.paint = function(m) {
    var t;
    while ((t = m.pop())) { this.draw(t.x, t.y, t); }
};

/**
 * render the console continuously
 * @method start
 */
Console.prototype.start = function() {
    if (!this.isActive) {
        this.isActive = true;
        this.nextRender = this.rAF(this.render);
        if (this.ready) setTimeout(this.checkReady.bind(this), 0);
    }
};

/**
 * stop continuous console render loop
 * @method stop
 */
Console.prototype.stop = function() {
	this.cAF(this.nextRender);
    this.isActive = false;
};

///////////////////////////////////////////////////////////////////////////////////////
// INTERNAL USE ONLY //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

Console.prototype.createTiles = function() {
    var w = this.canvas.width,
        h = this.canvas.height,
        x, y, i, o, j, k, l, col,
        addX = true,
        addY = true;

    // is console width shrinking?
    if (this.tiles.length === this.width) addX = null;
    else if (this.tiles.length > this.width) {
        i = this.width;
        o = this.tiles.length;
        addX = false;
    // is console width growing?
    } else if (this.tiles.length < this.width) {
        i = this.tiles.length;
        o = this.width;
    }

    // is console height shrinking?
    if (this.tiles[0] && this.tiles[0].length === this.height) addX = null;
    else if (this.tiles[0] && this.tiles[0].length > this.height) {
        j = l = this.height;
        k = this.tiles[0].length;
        addY = false;
    // is console height growing?
    } else if (!this.tiles[0] || this.tiles[0].length < this.height) {
        j = l = (this.tiles[0]) ? this.tiles[0].length : 0;
        k = this.height;
    } else addY = null;

    if (addX === null && addY === null) return this.start();

    this.clear();

    i--;
    l--;
    x = this.marginX;
    while (++i < o) {
        if (addX) {
            this.tiles.push([]);
            col = this.tiles[i];
            j = l;
            y = this.marginY;
            while (++j < k) {
                if (addY) {
                    col.push({
                        c: this.base.c, // sprite number within sprite sheet
                        x: x, // x coord in pixels
                        y: y, // y coord in pixels
                        f: this.base.f, // foreground color
                        b: this.base.b, // background color
                        F: {
                            forecustom: (this.base.f.charAt) ? true : false,
                            backcustom: (this.base.b.charAt) ? true : false
                        },
                        key: (i + '_' + j)
                    });
                    y += this.tileHeight;
                } else col.pop();
            }
            x += this.tileWidth;
        } else this.tiles.pop();
    }
    this.start();
};

/**
 * [onResize description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
Console.prototype.onResize = function(event) {
    this.stop();
    this.rAF(this.resize);
};

Console.prototype.getDims = function() {
    this.dims = [
        (this.canvas.width / window.innerWidth),
        (this.canvas.width / window.innerHeight)
    ];
};

Console.prototype.resize = function() {

    if (this.isFullscreen) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.width = this.canvas.width / this.tileWidth >> 0;
    this.height = this.canvas.height / this.tileHeight >> 0;

    this.marginX = (this.canvas.width - this.width * this.tileWidth) / 2 >> 0;
    this.marginY = (this.canvas.height - this.height * this.tileHeight) / 2 >> 0;

    if (this.tiles.length !== this.width || this.tiles[0].length !== this.height) this.createTiles();
    else this.start();
};

Console.prototype.checkReady = function(){
    if (this.sprites) {
        if (this.ready) {
            this.ready();
            this.ready = undefined;
        }
    } else setTimeout(this.checkReady.bind(this), 0);
};

// DRAW RELATED /////////////////////////////////////////////////////////////////////////////

Console.prototype.render = function(time) {
    while ( this.blit( this.queue.pop() ) ) ;
    this.rAF(this.render);
};

Console.prototype.blit = function(tile) {
    if (!tile) return false;

    // background color
    this.ctx.fillStyle = (tile.F.backcustom) ? tile.b : this.colors[tile.b];
    this.ctx.fillRect(tile.x, tile.y, this.tileWidth, this.tileHeight);    

    if (tile.F.forecustom) { //custom fore
        // forground color (painted only within the clipping mask of sprite sheet canvas)
        this.custom.fillStyle = tile.f;
        this.custom.fillRect(tile.c * this.tileWidth, this.colors.length * this.tileHeight, this.tileWidth, this.tileHeight);

        this.ctx.drawImage(this.sprites, tile.c * this.tileWidth, this.colors.length * this.tileHeight, this.tileWidth, this.tileHeight, tile.x, tile.y, this.tileWidth, this.tileHeight);
    } else {
        this.ctx.drawImage(this.sprites, tile.c * this.tileWidth, tile.f * this.tileHeight, this.tileWidth, this.tileHeight, tile.x, tile.y, this.tileWidth, this.tileHeight);
    }
    return true;
};

module.exports = Console;

// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] ||
                                       window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
        !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
},{"./sprites":3}],3:[function(require,module,exports){
'use strict';

var Sprites = function(sprites, colors){
	var image = new Image();

	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");
	this.width = sprites.width;
	this.height = sprites.height;
	this.count = sprites.count;

	this.canvas.height = this.height * (colors.length + 1);
	this.canvas.width = this.width * this.count;

	this.base = '#000';

	this.callback = sprites.onload;

	image.addEventListener("load", function() {
		var i = -1,
			l = colors.length,
			h = this.height,
			w = this.canvas.width;

		this.ctx.globalCompositeOperation = 'source-over';
		while (i++ <= l) {
			
			// draw clipping mask
			this.ctx.drawImage(image, 0, 0, w, h, 0, i * h, w, h);
		}

		this.ctx.globalCompositeOperation = 'source-atop';
		i = -1;
		while (i++ <= l) {
			// paint color into mask
			this.ctx.fillStyle = colors[i] || this.base;
			this.ctx.fillRect(0, i * h, w, h);
		}
        this.callback(this.canvas, this.ctx);
    }.bind(this), false);
    image.src = sprites.src;
};

module.exports = Sprites;
},{}]},{},[1]);
