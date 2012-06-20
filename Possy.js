(function ($) {

    var support = (function () {
        var style = document.createElement('div').style;
        style.backgroundPosition = 'right top';

        var result = {};

        /** Check backgroundPositionX/backgroundPositionY support */
        result.directions = 'backgroundPositionX' in style && 'backgroundPositionY' in style;

        /** Check if top/right/bottom/left values translated to numeric values by browser */
        result.translation = result.directions && style.backgroundPositionX.toLocaleLowerCase() !== 'right';

        return result;
    })();

    if (support.directions && support.translation)
        return;

    function parseValue(position) {
        return position
            .replace(/left|top/i, '0px')
            .replace(/right|bottom/i, '100%')
            .replace(/([0-9\.]+)(\s|$)/, "$1px$2");
    }

    function parsePosition(position) {
        var parts = position.split(' ');
        return {
            x: parseValue(parts[0]),
            y: parseValue(parts[1])
        };
    }

    var baseProperty = 'backgroundPosition';

    $.each(['X', 'Y'], function (_, direction) {
        var currentProperty = baseProperty + direction;
        $.cssHooks[currentProperty] = {
            set: function (element, value) {
                var parts = parsePosition($.curCSS(element, baseProperty));
                parts[direction.toLowerCase()] = parseValue(value);
                element.style.backgroundPosition = parts.x + ' ' + parts.y;
            },
            get: function (element) {
                return parsePosition($.curCSS(element, baseProperty))[direction.toLowerCase()];
            }
        };
        $.fx.step[currentProperty] = function (fx) {
            $.style(fx.elem, baseProperty + direction, fx.now + fx.unit);
        };
    });

})(jQuery);