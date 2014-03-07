<?php

// Cli-Config utility for Doctrine
require_once "engine/bootstrap_db.php";
return \Doctrine\ORM\Tools\Console\ConsoleRunner::createHelperSet(DB::$entityManager);

?>