#!/bin/bash

function usage {
	echo "Usage: $0 [command]"
	echo ""
	echo "Commands:"
	echo "   install 	Install dependencises and setup database for first use"
	echo "   update 	Update dependencies and database schema"
	echo "   update-db 	Update the database schema"
	echo ""
}

function deps_install {
	echo "Installing dependencies..."
	php composer.phar install
}

function deps_update {
	echo "Updating dependencies..."
	php vendor/composer.phar update
}

function db_create {
	echo "Creating database..."
	php vendor/bin/doctrine orm:schema-tool:create
}

function db_update {
	echo "Updating database..."
	php vendor/bin/doctrine orm:schema-tool:update --force
}

case "$1" in

	"install")
		deps_install
		db_create
		;;

	"update")
		deps_update
		db_update
		;;

	"update-db")
		db_update
		;;

	*)
		usage
		exit 1
		;;
esac
