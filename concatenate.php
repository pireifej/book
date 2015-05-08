<?php
$HOME = getenv('HOME');
if (empty($argv[1])) {
	echo "Oops - please give me a list of directory names!\n";
	exit;
}
$dirs = unserialize($argv[1]);
$data = "$HOME/book/images/data";
file_put_contents($data, "");
$my_file = fopen($data, "w");
fwrite($my_file, "{\n");
$file_count = 0;
$dir_file_count = shell_exec("ls $HOME/book/images/*/*gpg | wc -l");
$dir_file_count = str_replace(array("\n", "\r"), '', $dir_file_count);
foreach ($dirs as $dir) {
	foreach (new DirectoryIterator("$HOME/book/images/$dir") as $file_info) {
		if($file_info->isDot()) continue;
		if($file_info->isDir()) continue;
		$file = $file_info->getPathname();
		if (pathinfo($file, PATHINFO_EXTENSION) != "gpg") continue;
		$file_count++;
		echo "concatenating $file ($file_count/$dir_file_count)...\n";
		fwrite($my_file, "\"" . pathinfo($file, PATHINFO_FILENAME) . "\":[\n");
		$lines = file($file);
		$count = count($lines);
		$i = 0;
		foreach ($lines as $line) {
			$i++;
			$line = str_replace(array("\n", "\r"), '', $line);
			if ($i == $count) {
				fwrite($my_file, "\"" . $line . "\"\n");
			} else {
				fwrite($my_file, "\"" . $line . "\",\n");
			}
		}
		if ($file_count == $dir_file_count) {
			fwrite($my_file, "]");
		} else {
			fwrite($my_file, "],");
		}
	}
}
fwrite($my_file, "\n}");
fclose($my_file);
return 0;
?>