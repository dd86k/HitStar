"use strict";

/**
 * Creates a new Graph object to attach to a HTMLCanvasElement.
 * @param {HTMLCanvasElement} node 
 */
function RoundGauge(node) {
	this._width = node.width;
	this._height = node.height;
	this._radius = (this._width - this.lineWidth) / 2;
	this._hw = node.width / 2;
	this._hh = node.height / 2;
	this._c = node.getContext("2d");
	this._c.textAlign = "center";
	this._c.font = "20px monospace";
}
RoundGauge.prototype = {
	// 
	max: 100,
	lineWidth: 16,
	color: 'red',
	backcolor: '#eee',
	value: undefined,
	text: undefined,
	// 
	_c: undefined,
	_width: undefined,
	_height: undefined,
	_hw: undefined,
	_hh: undefined,
	_radius: undefined,
	_start: -(Math.PI / 2),

	update: function() {
		this._clear();
		this._c.fillText(this.text, this._hw, this._hh + 4);
		this._c.beginPath(); // background line
		this._c.arc(
			this._hw, this._hh, this._radius, 0, Math.PI * 2
		);
		this._c.strokeStyle = this.backcolor;
        this._c.lineCap = 'square';
		this._c.lineWidth = this.lineWidth;
		this._c.stroke();
		this._c.beginPath(); // foreground line
		this._c.arc(
			this._hw, this._hh, this._radius, this._start,
			this._start + (Math.PI * 2 * (this.value / this.max))
		);
		this._c.strokeStyle = this.color;
        this._c.lineCap = 'round';
		this._c.lineWidth = this.lineWidth;
		this._c.stroke();
	},
	_clear: function() {
		this._c.clearRect(0, 0, this._width, this._height);
	}
}
/**
 * Makes a new Graph, a chart-like object.
 * @param {HTMLCanvasElement} node 
 */
function Graph(node) {
	this._c = node.getContext("2d");
	this._width = node.width;
	this._height = node.height;
	//this._c.textAlign = "center";
	//this._c.font = "20px monospace";
}
Graph.prototype = {
	max: 100,
	yvalues: [],

	_xmax: 35,
	_xbump: 10,
	_c: undefined,
	_width: undefined,
	_height: undefined,

	push: function(y) {
		this.yvalues.push(y);
		//TODO: Calculate with WIDTH and XBUMP to remove items instead
		if (this.yvalues.length > this._xmax)
			this.yvalues = this.yvalues.slice(1);
		this.update();
	},
	update: function() {
		this._clear();
		var l = this.yvalues.length;
		if (l < 3) return;
		var lw = this._c.lineWidth;
		var h = this._height;

		this._c.moveTo(this._width, this.yvalues[--l]);
		this._c.beginPath();
		for (var x = this._width; l > 0; x -= this._xbump, --l) {
			this._c.lineTo(x,
				h - ((h - lw) * this.yvalues[l] / this.max)
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
			var used = j['used'];
			var total = j['total'];
			gauge_mem.gauge.text = _format(used) + '/' + _format(total);
			gauge_mem.gauge.value = used;
			gauge_mem.gauge.max = total;
			gauge_mem.gauge.update();

			graph_mem.graph.max = total;
			graph_mem.graph.push(used);
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
			gauge_cpu.gauge.text = j['avg'] + '%';
			gauge_cpu.gauge.value = j['avg'];
			gauge_cpu.gauge.update();

			graph_cpu.graph.push(j['avg']);
		}
	};
	r.open("GET", "api.php?t=cpu");
	r.send();
}

gauge_cpu.gauge = new RoundGauge(gauge_cpu);
gauge_mem.gauge = new RoundGauge(gauge_mem);
graph_cpu.graph = new Graph(graph_cpu);
graph_mem.graph = new Graph(graph_mem);
cpu();
mem();
setInterval(mem, 1500);
setInterval(cpu, 1500);