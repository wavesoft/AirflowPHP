<?php

/**
 * FlatCMS Core Initialization
 *
 * This script ensures that even in the worst case scenario that nothing could
 * be loaded, we can still display a nice error message.
 *
 */

// Include error handler
require_once("common/errors.php");

// Site configuration
define("ENGINE_ROOT", dirname(__DIR__));
define("SITE_ROOT", dirname( ENGINE_ROOT ));
$FLATCMS_ROOT = dirname(__DIR__);

// Include config
require_once( SITE_ROOT . "/config/config.php" );

// Include autoloader
require_once( ENGINE_ROOT . "/vendor/autoload.php");

?>