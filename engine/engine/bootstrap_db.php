<?php

/**
 * FlatCMS Database Initialization
 *
 * This script initializes Doctrine and connects to the database service.
 *
 */

// Require core initialization
require_once("bootstrap_core.php");
require_once("db.php");

// Import Doctrine namespace
use Doctrine\ORM\Tools\Setup;

// Create a simple "default" Doctrine ORM configuration for Annotations
$isDevMode = true;
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/db"), $isDevMode);
// or if you prefer yaml or XML
//$config = Setup::createXMLMetadataConfiguration(array(__DIR__."/config/xml"), $isDevMode);
//$config = Setup::createYAMLMetadataConfiguration(array(__DIR__."/config/yaml"), $isDevMode);

// Populate connection configuration depending on the DB_DRIVER configuration
$conn = array( );
if (!defined('DB_DRIVER')) 
	die_configError("Missing DB_DRIVER directive in the configuration");
if (DB_DRIVER == "pdo_sqlite") {

	if (!defined('DB_PATH'))
		die_configError("Missing DB_PATH directive in the configuration");
	$conn = array(
		'driver' => 'pdo_sqlite',
		'path' => DB_PATH
	);

} else {

	if (!defined('DB_USER'))
		die_configError("Missing DB_USER directive in the configuration");
	if (!defined('DB_PASSWORD'))
		die_configError("Missing DB_PASSWORD directive in the configuration");
	if (!defined('DB_HOST'))
		die_configError("Missing DB_HOST directive in the configuration");
	if (!defined('DB_NAME'))
		die_configError("Missing DB_NAME directive in the configuration");

	$conn = array(
	    'dbname' => DB_NAME,
	    'user' => DB_USER,
	    'password' => DB_PASSWORD,
	    'host' => DB_DRIVER
	);

}

// Initialize database class
DB::Initialize($conn, $config);

?>