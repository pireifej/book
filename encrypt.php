<?php
$HOME = getenv('HOME');
$dirs = array("multitasking", "sleeping", "eating", "birthdays", "fun", "intro" );
foreach ($dirs as $dir) {
	foreach (new DirectoryIterator("$HOME/book/images/$dir") as $file_info) {
		if($file_info->isDot()) continue;
		if($file_info->isDir()) continue;
		$file = $file_info->getPathname();
		if (strpos($file, ".base64.") == false) {
			continue;
		}
		$new_file = dirname($file) . "/" . basename($file, ".base64.jpg") . ".gpg";
		echo "encrypting $file ... ";
		$command = "/usr/bin/gpg --yes --trust-model always --encrypt --armor --recipient 'Ireifej' --output '" . $new_file . "' --batch --homedir /home/ireifej/.gnupg " . $file;
		exec($command);
		echo "$new_file created.\n";
	}
}
?>