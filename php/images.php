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
$images = glob($dir."*.{jpg,jpeg,png,gif,m4v,mp4}", GLOB_BRACE);
$list = [];

foreach($images as $image){
	$list[] = $image;
}

shuffle($list);

echo json_encode($list);
