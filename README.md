Possy
=====

jQuery plugin for separate background-position (x/y) animations/manipulations. All jQuery.css and jQuery.animate features are supported

Usage
=====

    $('el').css('background-position-x', 100);
    $('el').css({ backgroundPositionX: 100 });
    $('el').animate({ backgroundPositionX: 100 })
    $('el').css({ backgroundPositionX: 100 }).animate({ backgroundPositionX: '-=100' })