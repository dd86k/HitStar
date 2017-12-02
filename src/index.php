<?php
require_once 'utils.php';
const VERSION = "0.0.0";
const BRANCH = 'debug';
const PROJECT_RELEASE = 'HitStar '.VERSION.'-'.BRANCH;
const _RELEASE = FALSE;
?><!DOCTYPE html>
<html>
<head>
	<title><?= PROJECT_RELEASE ?></title>
	<link rel="stylesheet" type="text/css" href="hitstar<?php
		if (_RELEASE) echo '.min';
	?>.css">
	<meta charset="utf-8"/>
</head>
<body>
	<nav>
		<span>HitStar</span>
	<ul>
		<li><a href="#">Dashboard</a></li>
		<li><a href="#">Asterisk</a>
		<ul>
			<li><a href="#">Sub Menu 1</a></li>
			<li><a href="#">Sub Menu 2</a></li>
			<li><a href="#">Sub Menu 3</a></li>
			<li><a href="#">Sub Menu 4</a></li>
			<li><a href="#">Sub Menu 5</a></li>
		</ul>
		</li>
	</ul></nav>

	<div id="main">
		<div class="graph">
			<h3>CPU usage</h3>
			<div class="ss">
				<span>Usage percentage</span>
				<span>100%</span>
			</div>
			<canvas id="graph_cpu" width="300" height="180"></canvas>
			<div class="ss">
				<span>? seconds</span>
				<span id="span_cpu_used">0%</span>
			</div>
		</div>
		<div class="graph">
			<h3>Used memory</h3>
			<div class="ss">
				<span>Memory usage</span>
				<span><?=get_max_mem_formatted();?></span>
			</div>
			<canvas id="graph_mem" width="300" height="180"></canvas>
			<div class="ss">
				<span>? seconds</span>
				<span id="span_mem_used">0B</span>
			</div>
		</div>

		<h2>Uname</h2>
		<div><?= php_uname() ?></div>

<?php // Extras
		switch (PHP_OS) {
		case 'Linux':
			echo '<h2>Boot command</h2>';
			echo '<div>';
			echo @file_get_contents('/proc/cmdline');
			echo '</div>';
			break;
		}
?>
	</div>

	<footer>
		<strong><?= PROJECT_RELEASE ?></strong> by dd86k.
		PHP <?= PHP_VERSION ?> (<?= PHP_OS ?>)
	</footer>

	<script src="hitstar<?php
		if (_RELEASE) echo '.min';
	?>.js"></script>
</body>
</html>