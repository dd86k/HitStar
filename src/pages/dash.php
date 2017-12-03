<?php require_once __DIR__.'/../utils.php'; ?>
<div class="graph">
	<h3>CPU usage</h3>
	<div class="ss">
		<span>Usage percentage</span>
		<span>100%</span>
	</div>
	<canvas id="graph_cpu" width="300" height="180"></canvas>
	<div class="ss">
		<span>45 seconds</span>
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
		<span>45 seconds</span>
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

<script>
graph_cpu.graph = new Graph(graph_cpu, 'blue');
graph_mem.graph = new Graph(graph_mem, 'purple');
function refresh_cpu() {
	if (graph_cpu && span_cpu_used) {
		request_api('cpu', function(j) {
			graph_cpu.graph.push(j.avg);
			span_cpu_used.innerText = j.avg+'%';
		});
		setTimeout(refresh_cpu, 1000);
	}
}
function refresh_mem() {
	if (graph_mem && span_mem_used) {
		request_api('mem', function(j) {
			graph_mem.graph.max = j.total;
			graph_mem.graph.push(j.used);
			span_mem_used.innerText = _format(j.used);
		});
		setTimeout(refresh_mem, 1000);
	}
}
refresh_cpu();
refresh_mem();
</script>