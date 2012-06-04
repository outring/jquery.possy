(function ($) {

    function parseValue(position) {
        position = position
            .replace(/left|top/ig, '0px')
            .replace(/right|bottom/ig, '100%')
            .replace(/([0-9\.]+)(\s|$)/ig, "$1px$2");
        var result = [];
        var valueRegexp = /(-?[0-9\.]+)(px|%|em|pt)/ig;
        var match;
        while (match = valueRegexp.exec(position)) {
            result.push(parseFloat(match[1]));
            result.push(match[2]);
        }
        return result;
    }

    function parsePosition(position) {
        var res = parseValue(position);
        return {
            x: [res[0], res[1]],
            y: [res[2], res[3]]
        };
    }

    var baseProperty = 'backgroundPosition';

    $.each(['X', 'Y'], function (_, direction) {
        var currentProperty = baseProperty + direction;
        $.cssHooks[currentProperty] = {
            set: function (element, value) {
                var parts = parsePosition($.curCSS(element, baseProperty));
                parts[direction.toLowerCase()] = parseValue(value);
                element.style.backgroundPosition = parts.x.join('') + ' ' + parts.y.join('');
            },
            get: function (element) {
                return parsePosition($.curCSS(element, baseProperty))[direction.toLowerCase()].join('');
            }
        }
        $.fx.step[currentProperty] = function (fx) {
            $.style(fx.elem, baseProperty + direction, fx.now + fx.unit);
        };
    });

})(jQuery);