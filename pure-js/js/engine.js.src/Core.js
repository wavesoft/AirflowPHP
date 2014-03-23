
F.UpdateView = function() {

	// Initialize Node UI
	F.NodeUI.Initialize($("#fcms-body"));

	// Find the focused element
	F.NodeUI.focused = F.NodeUI.findNode(F.Hash.get('n'));

	// Initialize the original sizes of all elements
	F.NodeUI.onResize( false );

	// Navigate to the focused element (if we have such)
	if (F.NodeUI.focused) {

		// Calculate the offset position
		var scrollTo = F.NodeUI.focused.e.offset().top;
		console.log("Found element at ", scrollTo, " of ", F.Hash.get('n'));
		scrollTo += F.NodeUI.calculateAdditionalOffset( scrollTo );

		// Scroll to that element
		F.NodeUI.lockScroll = true;
		F.Scroller.scrollTo( scrollTo, function() {
			F.NodeUI.lockScroll = false;
		});

		// Load that element
		var node = F.NodeUI.findNode( F.Hash.get('n') );
		F.NodeUI.loadNode( node );

	}

}

/**
 * Load view information from the given URL
 */
F.LoadView = function(url) {

	console.log("Loading "+url);

	// Try to download
	$.ajax({
		
		'url': url,
		'dataType': 'json'

	}).done(function(data) {

		// Empty the body
		var e_body = $("#fcms-body");
		e_body.empty();

		// Create nodes
		for (var i=0; i<data.nodes.length; i++) {
			var node = F.NodeBuilder.buildNode(data.nodes[i]);
			e_body.append(node);
		}

		// Update view
		F.UpdateView();

	});

}

/**
 * Website initialization 
 */
F.Initialize = function() {

	// Populate the URL store with current hash
	F.Hash.parse();

	// Find page to load
	var page = "data/index.json",
		hash_nav = F.Hash.get('p');
	if (hash_nav) page = "data/" + hash_nav + ".json";
	F.LoadView(page);

	// Prepare scroller
	F.Scroller = new F.SmoothScroller($("#fcms-body"));
	F.Scroller.onTick(function() {
		F.NodeUI.updateLayerOffsets();
	});

	$("#fcms-body").scroll(function() {
		F.NodeUI.onScroll( true );
	});
	$(window).resize(function() {
		F.NodeUI.onResize( true );
	});
	$("#fcms-body").mousemove(function(e) {
		// Update location of the focus trigger bar according
		// to the mouse position
		F.NodeUI.triggerY = e.pageY;
	});

};
