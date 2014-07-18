define([], function() {
    'use strict';

    // From http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
    function Draggable() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (!attrs.draggable) {
                    return;
                }

                var el = element[0];

                el.draggable = true;

                var dragstart  = function(e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.classList.add('drag');
                    return false;
                };

                el.addEventListener(
                    'dragstart',
                    dragstart,
                    false
                );

                var dragend = function() {
                    this.classList.remove('drag');
                    return false;
                };

                el.addEventListener(
                    'dragend',
                    dragend,
                    false
                );
            }
        };
    }

    Draggable.$inject = [];

    return Draggable;
});
