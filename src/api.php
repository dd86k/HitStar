<?php
const WINDOWS = 'WINNT';
const LINUX = 'Linux';

function error($code, $desc) {
	return json_encode([
		'err' => $code,
		'msg' => $desc
	]);
}

header('Content-Type: application/json');
switch ($_GET['t']) { // Type
case 'cpu':
	switch (PHP_OS) {
    case WINDOWS:
		echo error(1, 'Not implemented');
		//wmic cpu get LoadPercentage
        break;
    case LINUX:
        if (is_readable('/proc/stat')) {
			$line = @file_get_contents('/proc/stat');
			$v = explode(' ', $line);
            $load0 = ($v[1]) + ($v[2]) + ($v[3]);
            sleep(1); // A jiffy is 1/100th of a second
            //usleep(500000); // Doesn't work, unless $sys*2 (but less accurate)
			$line = @file_get_contents('/proc/stat');
			$v = explode(' ', $line);
			$load1 = ($v[1]) + ($v[2]) + ($v[3]);

			$sys = $load1 - $load0;
			$corecount = // Cheap but works
				count(preg_split('/cpu/', $line, -1, PREG_SPLIT_NO_EMPTY)) - 1;

			echo json_encode([
				'sys' => $sys, // "Raw"
				'cpucount' => $corecount,
				'avg' => round($sys / $corecount, 2, PHP_ROUND_HALF_UP)
			]);
        } else echo error(1, '/proc/stat is unreadable');
    	break;
    }
	break;
case 'mem':
    switch (PHP_OS) {
	case WINDOWS:
		// Get total physical memory (this is in bytes)
		$cmd = "wmic ComputerSystem get TotalPhysicalMemory";
		@exec($cmd, $outputTotalPhysicalMemory);

		// Get free physical memory (this is in kibibytes!)
		$cmd = "wmic OS get FreePhysicalMemory";
		@exec($cmd, $outputFreePhysicalMemory);

		if ($outputTotalPhysicalMemory && $outputFreePhysicalMemory) {
			// Find total value
			foreach ($outputTotalPhysicalMemory as $line) {
				if ($line && preg_match("/^[0-9]+\$/", $line)) {
					$memoryTotal = $line;
					break;
				}
			}

			// Find free value
			foreach ($outputFreePhysicalMemory as $line) {
				if ($line && preg_match("/^[0-9]+\$/", $line)) {
					$memoryFree = $line;
					$memoryFree *= 1024;  // convert from kibibytes to bytes
					break;
				}
			}
		}
	break;
	case LINUX:
		/*if (is_readable("/proc/meminfo")) {
			$stats = @file_get_contents("/proc/meminfo");

			if ($stats !== false) {
				$stats = explode("\n", $stats);

				foreach ($stats as $statLine) {
					$line = explode(":", $statLine);
					switch ($line[0]) {
					case 'MemTotal':
						$total = trim($line[1]);
						$total = explode(" ", $total);
						$total = $total[0] * 1024; // kB -> B
						break;
					case 'MemFree':
						$free = trim($line[1]);
						$free = explode(" ", $free);
						$free = ($total - $free[0]); // kB -> B
						break;
					}
				}
			}
		}*/
		$out = [];
		$err = 0;
		@exec('free -b', $out, $err);
		$line = preg_split('/ /', $out[1], -1, PREG_SPLIT_NO_EMPTY);
        echo json_encode([
            'total' => $line[1],
            'used'  => $line[2],
            'free'  => $line[6]
        ]);
		break;
    }
    break;
}
?>