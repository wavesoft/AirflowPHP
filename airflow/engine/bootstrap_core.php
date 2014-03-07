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
$FLATCMS_ROOT = dirname(__DIR__);
$SITE_ROOT = dirname( $FLATCMS_ROOT );

// Include config
require_once( "$SITE_ROOT/config/config.php" );

// Include autoloader
require_once( "$FLATCMS_ROOT/vendor/autoload.php");

?>