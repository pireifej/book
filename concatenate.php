<?php
$HOME = getenv('HOME');
if (empty($argv[1])) {
	echo "Oops - please give me a list of directory names!\n";
	exit;
}
$dirs = unserialize($argv[1]);
$curr_dir = "*";
if (count($dirs) == 1) {
	$curr_dir = $dirs[0];
	$data = "$HOME/book/images/data.$curr_dir";
}

file_put_contents($data, "");
$my_file = fopen($data, "w");
fwrite($my_file, "{\n");
$file_count = 0;
//$dir_file_count = shell_exec("ls $HOME/book/images/intro/*gpg | wc -l") + shell_exec("ls $HOME/book/images/multitasking/*gpg | wc -l") + shell_exec("ls $HOME/book/images/eating/*gpg | wc -l") + shell_exec("ls $HOME/book/images/sleeping/*gpg | wc -l") + shell_exec("ls $HOME/book/images/birthdays/*gpg | wc -l");
$dir_file_count = shell_exec("ls $HOME/book/images/$curr_dir/*gpg | wc -l");

$dir_file_count = str_replace(array("\n", "\r"), '', $dir_file_count);
foreach ($dirs as $dir) {
	foreach (new DirectoryIterator("$HOME/book/images/$dir") as $file_info) {
		if($file_info->isDot()) continue;
		if($file_info->isDir()) continue;
		$file = $file_info->getPathname();
		if (strpos($file, ".base64.") == false) {
			continue;
		}
		$file_count++;
		echo "concatenating $file ($file_count/$dir_file_count)...\n";
		fwrite($my_file, "\"" . str_replace(".base64", "", pathinfo($file, PATHINFO_FILENAME)) . "\":[\n");
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

echo "gpg --yes --trust-model always --encrypt --armor --recipient 'Ireifej' --output $data.gpg --batch --homedir /home/ireifej/.gnupg $data";
echo "created $data.gpg.\n";
return 0;
?>