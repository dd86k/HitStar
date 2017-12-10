<?php
const VERSION = "0.0.0";
const PROJECT_RELEASE = 'HitStar '.VERSION;
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
		<li><a href="?p=dash">Dashboard</a></li>
		<li><a href="?p=a">Asterisk</a>
		<ul>
			<li><a href="?p=a_peers">Peers</a></li>
			<li><a href="">Sub Menu 2</a></li>
			<li><a href="">Sub Menu 3</a></li>
			<li><a href="">Sub Menu 4</a></li>
			<li><a href="">Sub Menu 5</a></li>
		</ul>
		</li>
		<li><a href="?p=test">Test123</a>
	</ul></nav>

	<script src="hitstar<?php
		if (_RELEASE) echo '.min';
	?>.js"></script>

	<div id="main">
<?php if (isset($_GET['p'])) {
	$p = 'pages/'.$_GET['p'].'.php';
	if (file_exists($p)) {
		include_once $p;
	} else {
		include_once 'pages/404.php';
	}
} else {
	include_once 'pages/dash.php';
}?>
	</div>

	<footer>
		<strong><?= PROJECT_RELEASE ?></strong> by dd86k.
		PHP <?= PHP_VERSION ?> (<?= PHP_OS ?>)
	</footer>

</body>
</html>