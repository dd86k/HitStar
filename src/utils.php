<?php

function _format($s) {
	if ($s >= 1073741824)
		return number_format($s/1073741824,2).'G';
	if ($s >= 1048576)
		return floor($s/1048576).'M';
	if ($s >= 1024)
		return floor($s/1024).'K';
	return $b.'B';
}

function get_max_mem_formatted() {
	$out = [];
	$err = 0;
	@exec('free -b', $out, $err);
	$line = preg_split('/ /', $out[1], -1, PREG_SPLIT_NO_EMPTY);
	return _format($line[1]);
}