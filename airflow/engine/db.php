<?php

use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\Connection;

class DB {

	/**
	 * The Doctrine Entity Manager
	 */
	static public $entityManager;

	/**
	 * Initialize database by creating the entity manager
	 */
	static function Initialize($conn, $config) {

		// Create entity manager
		DB::$entityManager = EntityManager::create($conn, $config);

	}

	/**
	 * Store the given entity to the database
	 */
	static function save($entity) {
		// Store entity on the entity manager
		DB::$entityManager->persist( $entity );
		DB::$entityManager->flush();
	}

	/**
	 * Return all the objects of the given kind
	 */
	static function getAll( $kind ) {
		$repos = DB::$entityManager->getRepository($kind);
		return $repos->findAll();
	}

	/**
	 * Get an object of the given kind and ID
	 */
	static function get( $kind, $id ) {
		return DB::$entityManager->find($kind, $id);
	}

	/**
	 * Get a query builder
	 */
	static function query() {
		return DB::$entityManager->createQueryBuilder();
	}

}

?>