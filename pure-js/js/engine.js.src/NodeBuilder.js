
/**
 * @class Node Builder static instance
 */
F.NodeBuilder = {

	/**
	 * Renderer of chunk objects
	 */
	'chunkRenderers': { }

};

F.NodeBuilder.buildChunk = function(data) {

	// Create chunk
	var chunk = $('<div></div>');
	chunk.addClass("chunk");

	// Render chunk
	var ctype = "raw";
	if (data['type'] != undefined)
		ctype = data['type'];

	// Get chunk body
	var cbody = data['body'];

	// Render body
	chunk.append(this.chunkRenderers[ctype]( cbody ));

	// Return chunk
	return chunk;

}

F.NodeBuilder.buildLayer = function(data) {

	// Create layer
	var layer = $('<div></div>');
	layer.addClass("layer");

	// Calculate height
	var t_value=0, t_class="";
	if (data['type'] != undefined) t_value=data['type'];
	switch (t_value) {
		case 0:
			t_class = "l-parallax l-back"
			break;
		case 1:
			t_class = "l-fixed"
			break;
		case 2:
			t_class = "l-body"
			break;
		case 3:
			t_class = "l-parallax l-front"
			break;
	}
	layer.addClass(t_class);

	// Replace some style attributes
	var style = { };
	if (data['style'] != undefined) style=data['style'];
	if (style['background'] != undefined)
		layer.css("background", style['background']);
	if (style['class'] != undefined)
		layer.addClass(style['class']);
	$.each(style, function(k,v) {
		layer.css(k,v);
	});

	// Process layers
	if (data['chunks'] != undefined) {

		// Do some intelligent analysis over the chunks
		var responsive=false, maxCol=0;
		for (var i=0; i<data['chunks'].length; i++) {
			var c = data['chunks'][i];

			// Check if the chunk is responsice
			if (c['responsive'] != undefined) {
				if (c['responsive']) {
					responsive = true;

					// Check the maximum columns used
					var col = c['col'];
					if (col == undefined) col=0;
					if ((col==1) || (col==2) || (col==4)) {
						if (maxCol<1) maxCol=1;
					} else if ((col==3) || (col==5)) {
						if (maxCol<2) maxCol=2;
					} else if (col==6) {
						if (maxCol<3) maxCol=3;
					}

				}
			}
		}

		// Check the responsive layout to use
		var t_responsive=maxCol, e_responsive=[], e;
		if (data['responsive'] != undefined) t_responsive=data['responsive'];
		switch (t_responsive) {

			case 1:
				layer.append($('<div class="col-xs-2"></div>'));
				layer.append(e_responsive[0] = $('<div class="col-xs-8"></div>'));
				layer.append($('<div class="col-xs-2"></div>'));
				break;

			case 2:
				layer.append(e_responsive[0] = $('<div class="col-xs-6"></div>'));
				layer.append(e_responsive[1] = $('<div class="col-xs-6"></div>'));
				break;

			case 3:
				layer.append(e_responsive[0] = $('<div class="col-xs-4"></div>'));
				layer.append(e_responsive[0] = $('<div class="col-xs-4"></div>'));
				layer.append(e_responsive[1] = $('<div class="col-xs-4"></div>'));
				break;

		}

		// Add 'row' class for Bootstrap responsiveness
		var responsiveElements = { };
		if (responsive) {
			layer.addClass('row');
		}

		// Store chunks
		for (var i=0; i<data['chunks'].length; i++) {
			var cdata = data['chunks'][i],
				chunk = this.buildChunk( cdata );

			// Process horizontal positioning according
			// to the responsive layout
			if (responsive && (cdata['responsive'] != undefined) && cdata['responsive'] &&
					(cdata['col'] != undefined) && (cdata['col'] > 0)) {

				// Check on which responsive column
				// to drop this chunk
				switch (cdata['col'] || 0) {
					
					case 1:
					case 2:
					case 4:
						// First column
						e_responsive[0].append(chunk);
						break;

					case 3:
					case 5:
						// Second column
						if (e_responsive.length >= 2)
							e_responsive[1].append(chunk);
						break;

					case 6:
						// Third column
						if (e_responsive.length >= 3)
							e_responsive[2].append(chunk);
						break;

				}

			} else {

				// Append on the root
				layer.append(chunk);

				// Setup horizontal alignment of the element
				switch (cdata['col'] || 0) {
					case 0:
						chunk.addClass("x-full");
						break;
					case 1:
						chunk.addClass("x-center");
						break;
					case 2:
						chunk.addClass("x-hv-1");
						break;
					case 3:
						chunk.addClass("x-hv-2");
						break;
					case 4:
						chunk.addClass("x-tr-1");
						break;
					case 5:
						chunk.addClass("x-tr-2");
						break;
					case 6:
						chunk.addClass("x-tr-3");
						break;
				}

				// Setup vertical alignment of the element
				switch (cdata['row'] || 0) {
					case 0:
						chunk.addClass("y-full");
						break;
					case 1:
						chunk.addClass("y-center");
						break;

					case 2:
						chunk.addClass("y-hv-1");
						break;
					case 3:
						chunk.addClass("y-hv-2");
						break;

					case 4:
						chunk.addClass("y-tr-1");
						break;
					case 5:
						chunk.addClass("y-tr-2");
						break;
					case 6:
						chunk.addClass("y-tr-3");
						break;

					case 7:
						chunk.addClass("y-cm-title");
						break;
					case 6:
						chunk.addClass("y-cm-subtitle");
						break;
					case 8:
						chunk.addClass("y-cm-body");
						break;
					case 9:
						chunk.addClass("y-cm-footer");
						break;
				}



			}

		}

	}

	// Return layer
	return layer;

}

F.NodeBuilder.buildNode = function(data) {

	// Create node
	var node = $('<div></div>');
	node.addClass("node");

	// Calculate height
	var h_value=0, h_class="";
	if (data['height'] != undefined) h_value=data['height'];
	switch (h_value) {
		case 0:
			h_class = "h-fl"
			break;
		case 1:
			h_class = "h-fl-b"
			break;
		case 2:
			h_class = "h-hl"
			break;
		case 3:
			h_class = "h-hl-b"
			break;
		case 4:
			h_class = "h-b"
			break;
		case 5:
			h_class = "h-lg"
			break;
		case 6:
			h_class = "h-md"
			break;
		case 7:
			h_class = "h-sm"
			break;
	}
	node.addClass(h_class);

	// Assign id
	if (data['id'] != undefined) {
		node.attr("id", data['id']);
	}

	// Check if node is fixed
	if (data['fix'] != undefined) {
		if (data['fix'])
			node.addClass('node-topfix');
	}

	// Process layers
	if (data['layers'] != undefined) {
		var layers = data['layers'];

		// Sort layers according to their order
		layers.sort(function(a,b) {
			var aType=0, bType=0;

			// Extract a and b type
			if (a['type'] != undefined)
				aType = a['type'];
			if (b['type'] != undefined)
				bType = b['type'];

			// Sort ascending
			return (aType - bType);
		});

		// Store layers
		for (var i=0; i<layers.length; i++) {
			node.append(this.buildLayer( layers[i] ));
		}

	}

	// Return node
	return node;

}