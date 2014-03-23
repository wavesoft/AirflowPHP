<?php

error_reporting(E_ALL);
require_once("engine/bootstrap.php");

/*
$nodes = DB::getAll("Node");
echo "<ul>";
foreach ($nodes as $n) {
	echo "<li>".$n->getName()."</li>";
}
echo "</ul>";
*/

$page = Theme::template("main.tpl");

$node = new Node();


	$layer = new Layer(LayerPosition::Fixed);
	$layer->background->color = "#FF0000";
	$layer->background->url = Theme::url("img/back-1.jpg");

		$chunk_1 = new Chunk("This is a body");
		$layer->addChunk($chunk_1);

		$chunk_2 = new Chunk("This is a chunk");
		$layer->addChunk($chunk_2);

	$node->addLayer($layer);


$page->assign("nodes", array( $node ));
$page->display();

?>
