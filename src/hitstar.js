"use strict";

/**
 * Construct a new 2D Graph.
 * @param {HTMLCanvasElement} node Node
 * @param {Color} color Line color
 */
function Graph(node, color) {
	this._width = node.width;
	this._height = node.height;
	this.vals = [];
	this.max = 100;
	this._xbump = 10;
	this._xmax = (this._width / this._xbump) + 1;
	this._c = node.getContext("2d");
	this._c.strokeStyle = color;
	//this._c.textAlign = "center";
	//this._c.font = "20px monospace";
}
Graph.prototype = {
	/**
	 * Push a value in stack and update graph.
	 * @param {Number} v Value
	 */
	push: function(v) {
		this.vals.push(
			// Scale Y here
			this._height - ((this._height - this._c.lineWidth) * v / this.max)
		);
		if (this.vals.length > this._xmax)
			this.vals.shift(); // like v[1..$]
		this.update();
	},
	update: function() {
		this._clear();
		var l = this.vals.length;
		if (l <= 1) return;

		this._c.moveTo(this._width, this.vals[--l]);
		this._c.beginPath();
		for (var x = this._width; l >= 0; x -= this._xbump) {
			this._c.lineTo(x, this.vals[l--]); // Scale Y
			this._c.stroke();
		}
		this._c.closePath();
	},
	_clear: function() {
		this._c.clearRect(0, 0, this._width, this._height);
	}
}

function _format(s) {
	const KB = 1024;
	const MB = KB * 1024;
	const GB = MB * 1024;
	if (s > GB) // GB
		return (s/GB).toFixed(1) + 'G';
	if (s > MB) // MB
		return Math.floor(s/MB) + 'M';
	if (s > KB) // KB
		return Math.floor(s/KB) + 'K';
	return s + 'B';
}

function request_api(s, f) {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
		if (r.readyState == 4 && r.status == 200) {
			f(JSON.parse(r.responseText));
		}
	}
	r.open("GET", "api.php?t="+s);
	r.send();
}

/**
 * Load a page dynamically.
 * @param {String} s Page
 */
function load_page(s) {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
		switch (r.readyState) {
		case 4:
			switch (r.status) {
			case 200:
				main.innerHTML = r.responseText;
				break;
			}
			break;
		}
	}
	r.open("GET", 'pages/'+s+'.php');
	r.send();
}
function request_page(s) {
	//TODO: Place loading animation
	//history.pushState(
	load_page(s);
}

mainnav.onclick = function (e) {
	e = e || window.event;
	var a = e.target || e.srcElement;
	if (a.tagName == 'A') {
		request_page(a.getAttribute('href'));
		return false;
	}
}