<?php
/**
 * Created by PhpStorm.
 * User: cekrem
 * Date: 2018-11-14
 * Time: 09:30
 */

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$dir = "logos/";
$logos = glob($dir."*.{svg, png}", GLOB_BRACE);
$list = [];

foreach($logos as $logo){
	$list[] = $logo;
}

sort($list);

echo json_encode($list);
