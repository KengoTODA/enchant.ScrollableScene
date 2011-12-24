(function () {

// borrow from enchant.js
var TOUCH_ENABLED = (function() {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
})();

/**
 * @scope enchant.ScrollableScene.prototype
 */
enchant.ScrollableScene = enchant.Class.create(enchant.Scene, {
	initialize: function () {
		enchant.Scene.call(this);
		var EVENT_NAMES = TOUCH_ENABLED
			 ? ['touchstart', 'touchmove', 'touchend']
			 : ['mousedown', 'mousemove', 'mouseup'],
		WHEEL_SPEED = 30,
		that = this;
		this.height = 0;
		this._scrollBar = document.createElement('div');
		this._scrollBar.style.position = 'fixed';
		this._scrollBar.style.overflow = 'hidden';
		this._scrollBar.style.backgroundColor = '#cccccc';
		this._scrollBar.style.width = '4px';
		this._scrollBar.style.top = '0px';
		this._scrollBar.style.right = '2px';
		this._element.appendChild(this._scrollBar);

		this._element.addEventListener(EVENT_NAMES[0],
			function (e) {
				that.dragStart = e.pageY;
			},
			false
		);
		this._element.addEventListener(EVENT_NAMES[1],
			function (e) {
				if (typeof that.dragStart !== 'undefined') {
					e.preventDefault();
					that.y += e.pageY - that.dragStart;
					that._fixPosition();
					that.dragStart = e.pageY;
				}
			},
			false
		);
		this._element.addEventListener(EVENT_NAMES[2],
			function (e) {
				delete that.dragStart;
			},
			false
		);
		this._element.addEventListener('mousewheel',
			function (e) {
				// http://www.adomas.org/javascript-mouse-wheel/
				function optimizeWheel(event) {
			    	var delta = 0;
					if (!event) /* For IE. */
						event = window.event;
					if (event.wheelDelta) { /* IE/Opera. */
						delta = event.wheelDelta/120;
					} else if (event.detail) { /** Mozilla case. */
						delta = -event.detail/3;
        			}
        			return delta;
				}
				that.y += optimizeWheel(e) * WHEEL_SPEED;
				that._fixPosition();
			},
			false
		);
	},

	addChild: function (node) {
		enchant.Scene.prototype.addChild.call(this, node);
		this.height = this._calcHeight(this.childNodes);
	},

	insertBefore: function (node, reference) {
		enchant.Scene.prototype.insertBefore.call(this, node, reference);
		this.height = this._calcHeight(this.childNodes);
	},

	removeChild: function (node) {
		enchant.Scene.prototype.removeChild.call(this, node);
		this.height = this._calcHeight(this.childNodes);
	},

	_fixPosition: function () {
		var gameHeight = enchant.Game.instance.height;
		this.y = Math.min(0, Math.max(this.y, enchant.Game.instance.height - this.height));
		this._scrollBar.style.top = ((gameHeight - this._scrollBar.height) * (this.y / (this.height - gameHeight))) + 'px';
	},

	_calcHeight: function (children) {
		var i, length, result = 0, child, gameHeight = enchant.Game.instance.height;
		for (i = 0, length = children.length; i < length; ++i) {
			child = children[i];
			result = Math.max(result, child.y + (child.height || 0));
		}
		this._scrollBar.style.height = Math.round(gameHeight * gameHeight / result) + 'px';
		return result;
	}
});
})();