<?php
$HOME = getenv('HOME');
if (empty($argv[1])) {
	echo "Oops - please give me a list of directory names!\n";
	exit;
}
$dirs = unserialize($argv[1]);
foreach ($dirs as $dir) {
	foreach (new DirectoryIterator("$HOME/book/images/$dir") as $file_info) {
		if($file_info->isDot()) continue;
		if($file_info->isDir()) continue;
		$file = $file_info->getPathname();
		if (pathinfo($file, PATHINFO_EXTENSION) != "jpg") continue;
		if (strpos($file, ".base64.") !== false) {
			continue;
		}
		$new_file = dirname($file) . "/" . basename($file, ".jpg") . ".base64.jpg";
		echo "converting $file ... ";
		$image_content = file_get_contents($file);
		$image_data = base64_encode($image_content);
		$full_data = "data:image/jpg;base64," . $image_data;
		$my_file = fopen($new_file, "w") or die("Unable to open file ". $new_file . "!");
		fwrite($my_file, $full_data);
		fclose($my_file);
		echo "$new_file created.\n";
	}
}
return 0;
?>