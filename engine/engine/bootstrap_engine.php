<?php

// Include database models
require_once("db/Node.php");

// Include the UI components
require_once("theme.php");

// Install the default theme
Theme::install( 
	"$FLATCMS_ROOT/theme/default", 
	"flatcms/theme/default",
	"$SITE_ROOT/cache",
	"cache"
);

?>