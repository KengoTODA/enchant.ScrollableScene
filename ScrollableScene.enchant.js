function () {

// borrow from enchant.js
var TOUCH_ENABLED = (function() {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
}
)();

/**
 * @scope enchant.ScrollableScene.prototype
 */
enchant.ScrollableScene = enchant.Class.create(enchant.Scene, {
	initialize: function () {
		enchant.Scene.call(this);
		var EVENT_NAMES = TOUCH_ENABLED
			 ? ['touchstart', 'touchmove', 'touchend']
			 : ['mousedown', 'mousemove', 'mouseup'],
		that = this;
		this.height = 0;

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
				that.y = Math.min(0, Math.max(that.y, enchant.Game.instance.height - that.height));
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
	},

	addChild: function (node) {
		enchant.Scene.prototype.addChild.call(this, node);
		this.height = this.calcHeight(this.childNodes);
	},

	insertBefore: function (node, reference) {
		enchant.Scene.prototype.insertBefore.call(this, node, reference);
		this.height = this.calcHeight(this.childNodes);
	},

	removeChild: function (node) {
		enchant.Scene.prototype.removeChild.call(this, node);
		this.height = this.calcHeight(this.childNodes);
	},

	calcHeight: function (children) {
		var i, length, result = 0, child;
		for (i = 0, length = children.length; i < length; ++i) {
			child = children[i];
			result = Math.max(result, child.y + (child.height || 0));
		}
		return result;
	}
});
}();