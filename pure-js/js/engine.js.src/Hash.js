/**
 * @class Singleton Hash URL Data
 */
F.Hash = {
	'data': { }
};

/**
 * Parse the location hash and populate the data fields
 */
F.Hash.parse = function() {
	var hash = window.location.hash;
	if (hash[0] == "#") hash = hash.substr(1);
	var parms = hash.split(",");
	for (var i=0; i<parms.length; i++) {
		var kv = parms[i].split(":");
		this.data[kv[0]] = kv[1];
	}
}

/**
 * Set a data field on the Hash store
 */
F.Hash.set = function(key, value) {
	this.data[key] = value;
	this.__update();
}

/**
 * Get a data field from the hash store
 */
F.Hash.get = function(key, defValue) {
	if (this.data[key] == undefined)
		return defValue;
	return this.data[key];
}

/**
 * Delete a field from the hash store
 */
F.Hash.del = function(key) {
	delete this.data[key];
	this.__update();
}

/**
 * Private function to commit the changes to the location hash
 */
F.Hash.__update = function() {
	var hash = "";
	for (k in this.data) {
		if (!k) continue;
		if (hash) hash+=",";
		hash += k+":"+this.data[k];
	}
	history.replaceState( this.data[k], "", window.location.href.split('#')[0] + '#'+hash );
}
