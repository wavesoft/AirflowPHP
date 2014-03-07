<?php

/**
 * Render the error to console
 */
function _message_console($type, $title, $message) {
	// Pretty formatting of the error for console
	echo "[ERROR] $title: $message\n";
}

/**
 * Render the error to browser
 */
function __message_html($type, $title, $message) {
	// Pretty formatting of the error
	if (!Theme::initialized()) {
?>
<!DOCTYPE html>
<html land="en">
	<head>
		<title>FlatCMS :: <?=ucfirst($type)?></title>
	</head>
	<body>
		<h1>FlatCMS <?=$title?> <?=$type?></h1>
		<p>Something went wrong while processing your request:</p>
		<pre><?=$message?></pre>
	</body>
</html>
<?php
	} else {

	}
}

/**
 * Display an error with the given title and message
 * and rounte it accordingly if we are begin run by
 * the console or the browser.
 */
function __message($type, $title, $message) {
	if ( empty($_SERVER['REMOTE_ADDR']) and !isset($_SERVER['HTTP_USER_AGENT']) and count($_SERVER['argv']) > 0) {
		_message_console($type, $title, $message);
	} else {
		_message_html($type, $title, $message);
	}
}

/**
 * Shorthands
 */
function die_configError($desc) {
	_message("error", "configuration", $desc );
	die();
}

?>