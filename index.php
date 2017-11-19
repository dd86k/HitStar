<?php
const VERSION = "0.2.0";
const BRANCH = 'debug';
const PROJECT_RELEASE = 'ddboard '.VERSION.'-'.BRANCH;
const _RELEASE = BRANCH == 'release';

?>

<!DOCTYPE html>
<html>
	<head>
	<title><?= PROJECT_RELEASE ?></title>
	<link rel="stylesheet" type="text/css" href="dboard<?php
		if (_RELEASE) echo '.min';
	?>.css">
	<meta charset="utf-8"/>
</head>
<body>
	<header>
		<?= PROJECT_RELEASE ?> - Dashboard on <?= PHP_OS ?>
	</header>

	<div id="cont">
		<div class="gauge">
			<h3>CPU usage</h3>
			<canvas id="gauge_cpu" width="180" height="180"></canvas>
		</div>
		<div class="gauge">
			<h3>Used memory</h3>
			<canvas id="gauge_mem" width="180" height="180"></canvas>
		</div>
		<div class="graph">
			<h3>CPU usage</h3>
			<canvas id="graph_cpu" width="300" height="180"></canvas>
		</div>
		<div class="graph">
			<h3>Used memory</h3>
			<canvas id="graph_mem" width="300" height="180"></canvas>
		</div>

		<h2>Uname</h2>
		<div><?= php_uname() ?></div>

<?php // Extra ..
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
		Written by dd86k. Running on PHP <?= PHP_VERSION ?> (Zend v<?= zend_version(); ?>)
	</footer>

	<script src="dboard<?php
		if (_RELEASE) echo '.min';
	?>.js"></script>
</body>
</html>