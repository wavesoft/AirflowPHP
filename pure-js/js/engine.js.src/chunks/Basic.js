
/**
 * RAW Chunk Renderer
 */
F.NodeBuilder.chunkRenderers['raw'] = function(data) {
	var body = $('<div></div>');
	body.html(data);
	return body;
}
