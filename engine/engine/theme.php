<?php

/**
 * Public static theme class where the template parts
 * are registered.
 */
class Theme {

	/**
	 * The smarty compiler
	 */
	static $SMARTY = null;

	/**
	 * The template directories and their additional info
	 */
	static $DIRECTORIES = array();

	/**
	 * Check if theme engine is initialized
	 */
	public static function initialized() {
		return !is_null(Theme::$SMARTY);
	}

	/**
	 * Install an additional theme to the theme registry
	 */
	public static function install( $relative ) {

		// Create a smarty instance if we don't have one already
		if (is_null(Theme::$SMARTY)) {
			
			// Setup cache
			Theme::$SMARTY = new Smarty();
			Theme::$SMARTY->cache_dir = SITE_ROOT . "/cache/s_cache";
			Theme::$SMARTY->compile_dir = SITE_ROOT . "/cache/c_compile";

			// Make sure directories exist
			if (!is_dir(Theme::$SMARTY->cache_dir))
				mkdir(Theme::$SMARTY->cache_dir);
			if (!is_dir(Theme::$SMARTY->compile_dir)) 
				mkdir(Theme::$SMARTY->compile_dir);
		}

		// Add template directory in the smarty instance
		Theme::$SMARTY->addTemplateDir( SITE_ROOT . $relative."/template" );

		// Append directory information
		array_push(Theme::$DIRECTORIES, array(
				SITE_ROOT . $relative, ROOT_URL . $relative."/static"
			));

	}

	/**
	 * Return a smarty template for the given template name
	 */
	public static function template($name) {

		// Calculate the cache_id
		$id = md5($_SERVER['REQUEST_URI']);

		// Return template instance
		if (!Theme::$SMARTY->templateExists($name)) {
			return null;

		} else {

			// Get extra information for this template
			$static = "/";
			foreach (Theme::$DIRECTORIES as $v) {
				if (file_exists($v[0].'/template/'.$name)) {
					$static = $v[1];
					break;
				}
			}

			// Create a smarty template
			$inst = Theme::$SMARTY->createTemplate($name, $id);

			// Populate the information we know about the tempalte
			$inst->assign('template', array(
					'static' => $static
				));

			// Return instance
			return $inst;

		}

	}

	/**
	 * Return the full path of the given static resource
	 */
	public static function res($name) {
		foreach (Theme::$DIRECTORIES as $v) {
			if (file_exists($v[0].'/static/'.$name)) {
				return $v[0].'/static/'.$name;
			}
		}
	}

	/**
	 * Return the URL for the given resource
	 */
	public static function url($name) {
		foreach (Theme::$DIRECTORIES as $v) {
			if (file_exists($v[0].'/static/'.$name)) {
				return $v[1].'/'.$name;
			}
		}
	}

}

?>