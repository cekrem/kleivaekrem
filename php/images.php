<?php
/**
 * Created by PhpStorm.
 * User: cekrem
 * Date: 2018-09-19
 * Time: 05:30
 */

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
$dir = "images/";
$images = glob($dir."*.{jpg,jpeg,png,gif}", GLOB_BRACE);
$list = [];

foreach($images as $image){
	$list[] = $image;
}

echo json_encode($list);
