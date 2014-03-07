<?php

error_reporting(E_ALL);
require_once("airflow/bootstrap.php");

$nodes = DB::getAll("Node");
echo "<ul>";
foreach ($nodes as $n) {
	echo "<li>".$n->getName()."</li>";
}
echo "</ul>";

?>