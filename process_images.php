<?php
$HOME = getenv('HOME');
$dirs = array("multitasking", "sleeping", "eating", "birthdays", "fun", "intro", "end" );
$command = "all";
if (!empty($argv[1])) {
	$command = $argv[1];
}

if ($command == "resize") {
	$template = $argv[2];
	$file = $argv[3];
	$convert = "convert " . $file . ".jpg -resize ";
	if ($template = "hor") {
		$size = "450x350";
	}
	if ($template = "ver") {
		$size = "375x500";
	}
	if ($template = "shor") {
		$size = "400x300";
	}
	if ($template = "sver") {
		$size = "600x300";
	}
	$convert .= $size . " " . $file . ".jpg";
	$result = shell_exec($convert);
	echo $result;
	exit;
}

if ($command == "all" || $command == "convert") {
	echo "Converting...\n";
	$result = shell_exec("php " . $HOME . "/book/convert.php " . escapeshellarg(serialize($dirs)));
	echo $result . "\n";
}

if ($command == "all" || $command == "encrypt") {
	echo "Encrypting...\n";
	$result = shell_exec("php " . $HOME . "/book/encrypt.php " . escapeshellarg(serialize($dirs)));
	echo $result;
}

if ($command == "all" || $command == "cat") {
	echo "Concatenating...\n";
	$result = shell_exec("php " . $HOME . "/book/concatenate.php " . escapeshellarg(serialize($dirs)));
	echo $result;
}

if ($command == "all" || $command == "clean") {
	echo "Cleaning...\n";
	foreach ($dirs as $dir) {
		foreach (new DirectoryIterator("$HOME/book/images/$dir") as $file_info) {
			if($file_info->isDot()) continue;
			if($file_info->isDir()) continue;
			$file = $file_info->getPathname();
			if (pathinfo($file, PATHINFO_EXTENSION) != "jpg") continue;
			echo "Deleting " . $file . "\n";
			unlink($file);
		}
	}
}
?>