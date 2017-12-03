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
		//TODO: Move the scaling part for the Y axis value here (from update())
		//      so that update() don't have to do the dirty work.
		this.vals.push(v);
		if (this.vals.length > this._xmax)
			this.vals.shift(); // like v[1..$]
		this.update();
	},
	update: function() {
		this._clear();
		var l = this.vals.length;
		if (l <= 1) return;
		var lw = this._c.lineWidth;
		var h = this._height;

		this._c.moveTo(this._width, this.vals[--l]);
		this._c.beginPath();
		for (var x = this._width; l >= 0; x -= this._xbump) {
			this._c.lineTo(x,
				h - ((h - lw) * this.vals[l--] / this.max) // Scale Y
			);
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
	const MB = 1024 * 1024;
	const GB = 1024 * 1024 * 1024;
	if (s > GB)
		return (s/GB).toFixed(1) + 'G';
	if (s > MB)
		return Math.floor(s/MB) + 'M';
	if (s > KB)
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

function refresh_cpu() {
	request_api('cpu', function(j) {
		graph_cpu.graph.push(j.avg);
		span_cpu_used.innerText = j.avg+'%';
	});
}
function refresh_mem() {
	request_api('mem', function(j) {
		graph_mem.graph.max = j.total;
		graph_mem.graph.push(j.used);
		span_mem_used.innerText = _format(j.used);
	});
}

graph_cpu.graph = new Graph(graph_cpu, 'blue');
graph_mem.graph = new Graph(graph_mem, 'purple');
refresh_cpu();
refresh_mem();
setInterval(refresh_mem, 1500);
setInterval(refresh_cpu, 1500);

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
	load_page(s);
}

mainnav.onclick = function (e) {
	e = e ||  window.event;
	var a = e.target || e.srcElement;
	if (a.tagName == 'A') {
		request_page(a.getAttribute('href'));
		return false; // prevent default action and stop event propagation
	}
}