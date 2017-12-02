"use strict";

/**
 * Makes a new Graph, a chart-like object.
 * @param {HTMLCanvasElement} node 
 */
function Graph(node, color) {
	this._width = node.width;
	this._height = node.height;
	this.vals = [];
	this.max = 100;
	this._xmax = 35;
	this._xbump = 10;
	this._c = node.getContext("2d");
	this._c.strokeStyle = color;
	//this._c.textAlign = "center";
	//this._c.font = "20px monospace";
}
Graph.prototype = {
	push: function(v) {
		this.vals.push(v);
		//TODO: Calculate with WIDTH and XBUMP to remove items instead
		if (this.vals.length > this._xmax)
			this.vals.shift(); // like v[1..$]
		this.update();
	},
	update: function() {
		this._clear();
		var l = this.vals.length;
		if (l <= 2) return;
		var lw = this._c.lineWidth;
		var h = this._height;

		this._c.moveTo(this._width, this.vals[--l]);
		this._c.beginPath();
		for (var x = this._width; l >= 0; x -= this._xbump, --l) {
			this._c.lineTo(x,
				h - ((h - lw) * this.vals[l] / this.max)
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

function mem() {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var j = JSON.parse(r.responseText);
			graph_mem.graph.max = j.total;
			graph_mem.graph.push(j.used);
		}
	};
	r.open("GET", "api.php?t=mem");
	r.send();
}
function cpu() {
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var j = JSON.parse(r.responseText);
			graph_cpu.graph.push(j.avg);
		}
	};
	r.open("GET", "api.php?t=cpu");
	r.send();
}

graph_cpu.graph = new Graph(graph_cpu, 'blue');
graph_mem.graph = new Graph(graph_mem, 'purple');
cpu();
mem();
setInterval(mem, 1500);
setInterval(cpu, 1500);