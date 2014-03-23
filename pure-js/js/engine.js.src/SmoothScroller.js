
/**
 * @class SmoothScroller - A smooth scrolling utility
 */
F.SmoothScroller = function(element) {

	// Prepare variables
	this.element = $(element);
	this.scrollPos = this.element.scrollTop();
	this.targetPos = this.scrollPos;
	this.timerID = 0;
	this.stopCallback = null;
	this.tickCallback = null;
	this.divider = 2;

	// Bind scroll callbacks
	var self = this;
	$(this.element).scroll(function(){
		self.onScroll();
	});
}

/**
 * Callback when a scroll occures
 */
F.SmoothScroller.prototype.onScroll = function() {
	var offset = this.element.scrollTop();
}

/**
 * Function to ask for a scroll
 */
F.SmoothScroller.prototype.scrollTo = function(where, callback, divider) {
	console.log("Scrolling to", where);
	this.targetPos = where;
	this.scrollPos = this.element.scrollTop();
	this.stopCallback = callback;
	this.divider = divider || 2;
	this.startTimer();
}

/**
 * Register an animation tick callback
 */
F.SmoothScroller.prototype.onTick = function(callback) {
	this.tickCallback = callback;
}

/**
 * Animation tick
 */
F.SmoothScroller.prototype.tick = function() {
	var scrollPos = this.element.scrollTop();

	// Check if we were scrolled away
	//console.log("Δ=", Math.abs(scrollPos - this.scrollPos));
	if (Math.abs(scrollPos - this.scrollPos) >= 1) {
		this.stopTimer();
		return;
	}

	// Animation step
	var delta = this.targetPos - this.scrollPos;
	this.scrollPos += delta / this.divider;

	// Check if we are close enouch
	if (Math.abs(this.scrollPos - this.targetPos) < 2) {
		this.scrollPos = this.targetPos;
		this.stopTimer();
	}

	// Scroll
	this.element.scrollTop( Math.round(this.scrollPos) );

	// Fire tick callback
	if (this.tickCallback) this.tickCallback();

}

/**
 * Abort timer
 */
F.SmoothScroller.prototype.stopTimer = function() {
	if (!this.timerID) return;
	clearTimeout(this.timerID);
	this.timerID = 0;
	var self = this;
	if (this.stopCallback) {
		setTimeout(function() {
			self.stopCallback();
		}, 50);
	}
}

/**
 * Start timer
 */
F.SmoothScroller.prototype.startTimer = function() {
	if (this.timerID) return;
	var self = this;
	this.timerID = setInterval(function() {
		if (requestAnimationFrame != undefined) {
			requestAnimationFrame(function() {
				self.tick();
			});
		} else {
			self.tick();
		}
	}, 25);
}
