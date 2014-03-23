/**
 * Node UI Management
 */
F.NodeUI = {
	'nodes': [],
	'focused': null,
	'scrollStopTimer': null,
	'lockScroll': false,
	'triggerY': window.innerHeight/3,

	'fixedTop' : {
		'e': null,
		'placeholder' : null
	},

	'STATE_EMPTY'	: 0,
	'STATE_LOADING'	: 1,
	'STATE_LOADED'	: 2,

	'parallax' : {
		'frontScale': 3.0,
		'backScale': 1.4
	},

	'size': {
		'horizontalBar': 42
	},

	'padding' : {
		'fixOverflow': 50
	}

};

/**
 * Scan for node changes
 */
F.NodeUI.Initialize = function(container) {
	this.nodes = [];
	this.host = container;

	// Populate the node elements
	$(container).children(".node").each(function(i,e){		
		F.NodeUI.nodes.push({
			'e'		: 	$(e),
			'id'	: 	$(e).attr('id') || "",
			'state': 	($(e).find(".layer.body").length > 0) ? F.NodeUI.STATE_LOADED : F.NodeUI.STATE_EMPTY,
			'layers': {
				'pxFront': $(e).find(".l-parallax.l-front"),
				'pxBack' : $(e).find(".l-parallax.l-back"),
				'body'	 : $(e).find(".l-body"),
				'fixed'	 : $(e).find(".l-fixed")
			}
		});
	});

	// Find the node that will be fixed on top
	var fixedNode = $(".node-topfix");
	if (fixedNode.length) {
		F.NodeUI.fixedTop.e = fixedNode;
	}

}

/**
 * Check if node is within visible range
 */
F.NodeUI.isVisible = function(node) {
	var elmPos = node['e'].position(),
		elmHeight = node['e'].height(),
		topEdge = elmPos.top, bottomEdge = elmPos.top + elmHeight;

	return ((topEdge >= 0) && (topEdge < window.innerHeight)) || 
	       ((bottomEdge >= 0) && (bottomEdge < window.innerHeight));
}

/**
 * Get the visibility percentage of a node
 */
F.NodeUI.getVisiblePercent = function(node) {
	var elmPos = node['e'].position(),
		elmHeight = node['e'].height(),
		topEdge = elmPos.top, bottomEdge = elmPos.top + elmHeight;

	if ((topEdge >= 0) && (topEdge < window.innerHeight)) {
   		if (bottomEdge < window.innerHeight) {
			return 1;
		} else {
			return 1.0-(bottomEdge-window.innerHeight) / elmHeight;
		}
	} else {
		return 0;
	}
}

/**
 * Calculate the extra offset for scrolling to the given offset.
 * This is currently used by the fixed element on top.
 */
F.NodeUI.calculateAdditionalOffset = function( elementOffset ) {
	if (!F.NodeUI.fixedTop.e) return 0;
	var e1 = F.NodeUI.fixedTop.e,
		e2 = F.NodeUI.fixedTop.placeholder;

	if (e2 && (elementOffset >= e2.offset().top)) {
		return -e2.height();
	}
	if (elementOffset >= e1.offset().top) {
		return -e1.height();
	}
	return 0;
}

/**
 * Update the offsets of each visible layer
 */
F.NodeUI.updateLayerOffsets = function() {

	// Process node events
	for (var i=0; i<this.nodes.length; i++) {
		var node = this.nodes[i],
			e = node['e'],
			elmPos = e.position(),
			elmHeight = e.height(),
			winHeight = window.innerHeight;

		// Do not process background offset if it's not visible
		if (this.isVisible(node)) {
			var offsetTop = -elmPos.top,
				elmMid = elmPos.top + elmHeight/2,
				parallaxScale = Math.max( -1.5, Math.min( 1.5, (elmMid - winHeight/2.0) / (winHeight/2.0) ) ),
				parallaxMid = offsetTop + winHeight/2;

			// Fix background element
			if (node['layers']['fixed'].length)
				node['layers']['fixed'].css({
					'top': offsetTop - F.NodeUI.padding.fixOverflow
				});

			// Position parallax elements
			var pxFrontHeight = winHeight * F.NodeUI.parallax.frontScale,
				pxFrontOverflow = winHeight - pxFrontHeight;
			if (node['layers']['pxFront'].length)
				node['layers']['pxFront'].css({
					'top': parallaxMid - pxFrontHeight/2.0 - pxFrontOverflow * parallaxScale/2.0
				});
			var pxBackHeight = winHeight * F.NodeUI.parallax.backScale,
				pxBackOverflow = winHeight - pxBackHeight;
			if (node['layers']['pxBack'].length)
				node['layers']['pxBack'].css({
					'top': parallaxMid - pxBackHeight/2.0 - pxBackOverflow * parallaxScale/2.0
				});

		}
	}

	// Check if we should fix/unfix the fixed element
	var e = F.NodeUI.fixedTop.e;
	if (e) {
		if (!e.hasClass("node-topfix-fixed")) {
			if (e.position().top <= 0) {

				// Create a space placeholder for the element
				var placeholder = $('<div class="l-fix-placeholder"></div>');
				placeholder.css({ 'height': e.height() });
				placeholder.insertBefore(e);
				F.NodeUI.fixedTop.placeholder = placeholder;

				// Make the element fix on top
				e.addClass("node-topfix-fixed");

			}
		} else {
			if ( F.NodeUI.fixedTop.placeholder && (F.NodeUI.fixedTop.placeholder.position().top > 0) ) {

				// Remove placeholder
				F.NodeUI.fixedTop.placeholder.remove();
				F.NodeUI.fixedTop.placeholder = null;
		
				// Unfix
				e.removeClass("node-topfix-fixed");
				
			}
		}
	}

}

/**
 * Update node information after resize
 */
F.NodeUI.onResize = function( trackFocused ) {

	// Resize the layers of all nodes
	var winHeight = window.innerHeight;
	for (var i=0; i<this.nodes.length; i++) {
		var node = this.nodes[i],
			e = node['e'];

		// Update the fixed & parallax layer heights
		if (node['layers']['fixed'].length)
			$(node['layers']['fixed']).css({
				'height': winHeight + F.NodeUI.padding.fixOverflow*20,
				'padding-top': F.NodeUI.padding.fixOverflow
			});
		var frameHeight = winHeight * F.NodeUI.parallax.frontScale;
		if (node['layers']['pxFront'].length)
			$(node['layers']['pxFront']).css({
				'height': frameHeight,
				'padding-top': (frameHeight-winHeight)/2.0
			});
		var frameHeight = winHeight * F.NodeUI.parallax.backScale;
		if (node['layers']['pxBack'].length)
			$(node['layers']['pxBack']).css({
				'height': frameHeight,
				'padding-top': (frameHeight-winHeight)/2.0
			});

		// Update the javascript-sized heights
		var minHeight = 100;
		if (e.hasClass("h-b"))
			e.css({ 'height': F.NodeUI.size.horizontalBar });
		if (e.hasClass("h-fl"))
			e.css({ 'height': Math.max(winHeight, minHeight) });
		if (e.hasClass("h-fl-b"))
			e.css({ 'height': Math.max(winHeight, minHeight) - F.NodeUI.size.horizontalBar });
		if (e.hasClass("h-hl"))
			e.css({ 'height': Math.max(winHeight/2.0, minHeight) });
		if (e.hasClass("h-hl-b"))
			e.css({ 'height': Math.max(winHeight/2.0, minHeight) - F.NodeUI.size.horizontalBar });

	};

	// Fire scroll
	this.onScroll( trackFocused );

}


/**
 * Update node information after scroll
 */
F.NodeUI.onScroll = function( trackFocused ) {
	var self = this,
		loadNext = false,
		foundVisible = false,
		foundFocus = false;

	// Check for lock-scroll
	if (this.lockScroll) return;

	// Prepare/reset the onScrollComplete timer
	if (this.scrollStopTimer)
		clearTimeout(this.scrollStopTimer);
	this.scrollStopTimer = setTimeout(function() {
		self.onScrollComplete();
	}, 500);

	// Update layer offsets
	this.updateLayerOffsets();

	// Track the focused element
	if (!trackFocused) return;
	for (var i=0; i<this.nodes.length; i++) {
		var node = this.nodes[i],
			e = node['e'],
			elmPos = e.position();

		// Check if the element is visible and not loaded
		// (Also load the next element in queue, for optimization)
		if (!foundVisible) {
			if (this.isVisible(node) && (node.state == F.NodeUI.STATE_EMPTY)) {
				this.loadNode(node);
				loadNext = true;
			}
			if (loadNext && (node.state == F.NodeUI.STATE_EMPTY)) {
				this.loadNode(node);
				loadNext = false;
				foundVisible = true;
			}
		}

		// Check for focused element
		if (!foundFocus && (elmPos.top+e.height() > this.triggerY) && (node['id'])) {
			if (this.focused && !$(e).is(this.focused['e'])) {
				this.focused = node;
				F.Hash.set("n", node['id']);
			}
			foundFocus = true;
		}

		// Check if we are done
		if (foundFocus && foundVisible) break;

	}
}

/**
 * Fired when the scroll is completed
 */
F.NodeUI.onScrollComplete = function() {

	// Find the offset to scroll to
	if (!this.focused) return;
	var scrollTo = this.focused['e'].offset().top + this.host.scrollTop();

	// Add some tollerance from target
	if ((Math.round(scrollTo) < 10) && (this.focused['e'].offset().top >= 10)) return;

	// Offset past the fixed header if we have one
	scrollTo += F.NodeUI.calculateAdditionalOffset( scrollTo );

	// Scroll
	F.NodeUI.lockScroll = true;
	F.Scroller.scrollTo( scrollTo, function() {
		F.NodeUI.lockScroll = false;
	}, 4);

}

/**
 * Find a node with the given ID
 */
F.NodeUI.findNode = function(id) {
	for (var i=0; i<this.nodes.length; i++) {
		var node = this.nodes[i];
		if (node.id == id) return node;
	}
	return null;
}

/**
 * Load the buffer of the specified node
 */
F.NodeUI.loadNode = function(node) {

	// Ensure valid node
	if (!node) return;
	
	// Switch to loading
	if (node.state != F.NodeUI.STATE_EMPTY) return;
	node.state = F.NodeUI.STATE_LOADING;

}
