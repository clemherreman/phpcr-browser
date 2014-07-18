define([], function() {
    'use strict';

    function Dropper() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: '=',
            template: '<div class="dropper" droppable><span class="glyphicon glyphicon-trash"></span></div>',
        };
    }

    Dropper.$inject = [];

    return Dropper;
});
