<?php

abstract class LayerPosition {

	/**
	 * The layer is the main layer
	 */
    const Body = 0;

	/**
	 * The layer is fixed in the back
	 */
    const Fixed = 1;

	/**
	 * The layer is the parallax layer on the back
	 */
    const ParallaxFront = 2;

	/**
	 * The layer is the parallax layer in front
	 */
    const ParallaxBack = 3;

}

abstract class NodeHeight {

	/**
	 * The layer occupies the entire height
	 */
	const Full = 1;

	/**
	 * The layer occupies the entire height minus 
	 * the navbar height
	 */
	const FullSubNavbar = 17;

	/**
	 * The layer occupies the half height
	 */
	const Half = 2;

	/**
	 * The layer occupies the half height minus 
	 * the navbar height
	 */
	const HalfSubNavbar = 18;

	/**
	 * The layer is navbar-height
	 */
	const Navbar = 3;

	/**
	 * The layer is "small"
	 */
	const Small = 4;

	/**
	 * The layer is "medium"-sized
	 */
	const Medium = 5;
	
	/**
	 * The layer is "large"
	 */
	const Large = 6;

}

class BackgroundImage {

	/**
	 * @var The background image
	 */
	public $url = null;

	/**
	 * @var The background color
	 */
	public $color = null;

	/**
	 * @var Horizontal position
	 */
	public $left = "center";

	/**
	 * @var Vertical position
	 */
	public $top = "center";

	/**
	 * @var Repeat
	 */
	public $repeat = false;

	/**
	 * Render style
	 */
	public function getStyle() {
		if (is_null($this->url) && is_null($this->color)) {
			return "";
		} else {
			$style = "";
			if (!is_null($this->color)) {
				$style .= $this->color." "; 
			}
			if (!is_null($this->url)) {
				$style .= 
					$this->left . " " .
					$this->top . " " .
					( $this->repeat ? "repeat" : "no-repeat" ) . " " .
					"url(" . $this->url .")";
			}
			return trim($style);
		}
	}

}

/**
 * Horizontal Position information
 */
class HorizontalPosition {

	/**
	 * Initialize horizontal position
	 */
	function __construct($responsive, $gridPosition, $gridSize) {
		$this->responsive = $responsive;
		$this->gridPosition = $gridPosition;
		$this->gridSize = $gridSize;
	}

	/**
	 * Use responsive flow for horizontal positioning
	 */
	public $responsive = false;

	/**
	 * Grid size
	 */
	public $gridSize = 3;

	/**
	 * Grid position
	 */
	public $gridPosition = 1;

}

/**
 * Chunk UI Object
 */
class Chunk {

	/**
	 * @var The template to use for rendering
	 */
	public $template = "chunk/raw.tpl";

	/**
	 * @var Flag to define if the positioning should be reponsive
	 */
	public $responsive = false;

	/**
	 * @var The horizontal positioning and size of the element
	 * @type HorizontalPosition
	 */
	public $col;

	/**
	 * @var The vertical positioning and size of the element
	 * @type VerticalPosition
	 */
	public $row;

	/**
	 * @var The body of the chunk
	 */
	public $body;

	/**
	 * Render the template
	 */
	public function __construct($body, $template="chunk/raw.tpl") {
		$this->body = $body;
		$this->template = $template;
	}

	/**
	 * Render the template
	 */
	public function render() {
		$tpl = Theme::template($this->template);
		$tpl->assign("chunk", array(
				"body" => $this->body,
				"col" => $this->col,
				"row" => $this->row
			));

		return $tpl->fetch();
	}

}

/**
 * Layer UI Object
 */
class Layer {

	/**
	 * @var The position of the layer
	 */
	public $position = LayerPosition::Body;

	/**
	 * @var The chunks in the layer
	 */
	public $chunks = array();

	/**
	 * @var The background image the layer
	 */
	public $background = null;

	/**
	 * Initialize layer
	 */
	public function __construct($position = LayerPosition::Body) {
		$this->position = $position;
		$this->background = new BackgroundImage();
	}

	/**
	 * Append a chunk in the layer
	 */
	public function addChunk($chunk) {
		$this->chunks[] = $chunk;
	}

	/**
	 * Get the classes of the layer
	 */
	public function getClasses() {

		// Check if we should use responsive layout
		$responsive = false;
		foreach ($this->chunks as $c) {
			if ($c->responsive) {
				$responsive = true;
				break;
			}
		}

		// Build classes
		$cls = "";
		if ($responsive) $cls .= "row ";

		// Pick layer positioning
		if ($this->position == LayerPosition::Body) {
			$cls .= " l-body";
		} elseif ($this->position == LayerPosition::Fixed) {
			$cls .= " l-fixed";
		} elseif ($this->position == LayerPosition::ParallaxFront) {
			$cls .= " l-parallax l-front";
		} elseif ($this->position == LayerPosition::ParallaxBack) {
			$cls .= " l-parallax l-back";
		}

		// Return class
		return trim($cls);

	}

	/**
	 * Get the layer's inline styles
	 */
	public function getStyle() {

		$style = "";

		// Put background image
		$style .= $this->background->getStyle();

		// Return style
		return $style;

	}

	/**
	 * Get the body of the layer
	 */
	public function getBody() {

		// Render the chunks
		$body = "";
		foreach ($this->chunks as $chunk) {
			$body .= $chunk->render();
		}

		// Return rendered body
		return $body;

	}

}

/**
 * Node UI Object
 */
class Node {

	/**
	 * @var The layers in the node
	 */
	public $layers = array();

	/**
	 * @var Height of the node
	 */
	public $height = NodeHeight::Large;

	/**
	 * Initialize the node UI element
	 */
	public function __construct($height = NodeHeight::Large) {
		$this->height = $height;
	}

	/**
	 * Add a layer in the node
	 */
	public function addLayer($layer) {
		$this->layers[] = $layer;
	}

	/**
	 * Get the classes of the base node
	 */
	public function getClasses() {

		$cls = "";
		switch ($this->height) {
			case NodeHeight::Full:
				$cls = "h-fl";
				break;
			case NodeHeight::FullSubNavbar:
				$cls = "h-fl-b";
				break;
			case NodeHeight::Half:
				$cls = "h-hl";
				break;
			case NodeHeight::HalfSubNavbar:
				$cls = "h-hl-b";
				break;
			case NodeHeight::Navbar:
				$cls = "h-b";
				break;
			case NodeHeight::Large:
				$cls = "h-lg";
				break;
			case NodeHeight::Medium:
				$cls = "h-md";
				break;
			case NodeHeight::Small:
				$cls = "h-sm";
				break;
		}
		
		return $cls;
	}

	/**
	 * Render the node
	 */
	public function render() {
		$tpl = Theme::template("blocks/node.tpl");
		$tpl->assign("node", $this);
		return $tpl->fetch();
	}

}

?>