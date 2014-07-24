define([], function () {
    "use strict";

    function loadRequestAnimationFrame($provide) {
        $provide.decorator('$window', ['$delegate', function($delegate) {
            $delegate.requestAnimFrame = (function(){
                return (
                    $delegate.requestAnimationFrame       ||
                    $delegate.webkitRequestAnimationFrame ||
                    $delegate.mozRequestAnimationFrame    ||
                    $delegate.oRequestAnimationFrame      ||
                    $delegate.msRequestAnimationFrame     ||
                    function(/* function */ callback){
                        $delegate.setTimeout(callback, 1000 / 60);
                    }
                );
            })();
            return $delegate;
        }]);
    }

    loadRequestAnimationFrame.$inject = ['$provide'];

    return loadRequestAnimationFrame;
});

