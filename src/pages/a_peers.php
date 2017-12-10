<?php
$s = fsockopen("192.168.0.244", 5038);
fputs($s, "Action: Login\r\n");
fputs($s, "UserName: admin\r\n");
fputs($s, "Secret: amp111\r\n\r\n");
fputs($s, "Action: Command\r\n");
fputs($s, "Command: Reload\r\n\r\n");
$wrets=fgets($s,128);

echo '<pre>';
echo $wrets;
echo '</pre>';