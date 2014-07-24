define([], function() {
    'use strict';

    function Overlay() {
        return {
            restrict: 'E',
            scope: {
                'text': '@',
                'showOn': '@',
                'hideOn': '@'
            },
            template: '<div class="overlay">{{ text }}</div>',
            link: function(scope, element) {
                scope.$on(scope.hideOn, function() {
                    element.hide();
                });

                scope.$on(scope.showOn, function() {
                    element.show();
                });
            }
        };
    }

    Overlay.$inject = [];

    return Overlay;
});
