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
	<nav id="mainnav">
		<span>HitStar</span>
	<ul>
		<li><a href="dash">Dashboard</a></li>
		<li><a href="#">Asterisk</a>
		<ul>
			<li><a href="#">Sub Menu 1</a></li>
			<li><a href="#">Sub Menu 2</a></li>
			<li><a href="#">Sub Menu 3</a></li>
			<li><a href="#">Sub Menu 4</a></li>
			<li><a href="#">Sub Menu 5</a></li>
		</ul>
		</li>
		<li><a href="test">Test123</a>
	</ul></nav>

	<div id="main">
		<?php require_once 'pages/dash.php' ?>
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