(function ($, undefined) {

	var support = (function () {
		var style = document.createElement('div').style;
		style.backgroundPosition = 'right top';

		var result = { };

		/** Check backgroundPositionX/backgroundPositionY support */
		result.directions = 'backgroundPositionX' in style && 'backgroundPositionY' in style;

		/** Check if top/right/bottom/left values translated to numeric values by browser */
		result.translation = result.directions && style.backgroundPositionX.toLocaleLowerCase() !== 'right';

		return result;
	})();

	if (support.directions && support.translation)
		return;

	function parseValue(position) {
		return position.replace(/left|top/i, '0px').replace(/right|bottom/i, '100%');
	}

	function getPositions(element) {
		var parts = $.css(element, baseProperty).split(' ');
		return { X: parts[0], Y: parts[1] };
	}

	var baseProperty = 'backgroundPosition';

	$.each(['X', 'Y'], function (_, direction) {
		var currentProperty = baseProperty + direction;
		var hook;
		if (support.directions)
			hook = {
				get: function (element, computed, isInternalCall) {
					if (isInternalCall)
						return undefined;
					var value = $.css(element, currentProperty, /** isInternalCall */ true);
					return computed ? parseValue(value) : value;
				}
			};
		else
			hook = {
				get: function (element, computed) {
					var value = getPositions(element)[direction];
					return computed ? parseValue(value) : value;
				},
				set: function (element, value) {
					var positions = getPositions(element);
					positions[direction] = value;
					element.style.backgroundPosition = positions.X + ' ' + positions.Y;
				}
			};
		$.cssHooks[currentProperty] = hook;
		$.fx.step[currentProperty] = function (fx) {
			$.style(fx.elem, baseProperty + direction, fx.now + fx.unit);
		};
	});

})(jQuery);
