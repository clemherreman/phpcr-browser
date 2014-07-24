define([
    'text!../../view/directive/navbarItem.html'
], function(itemTemplate) {
    'use strict';

    function NavbarItem() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                link: '=',
            },
            template: itemTemplate,
            controller: 'NavbarItemController',
            controllerAs: 'navbarItemController'
        };

    }

    NavbarItem.$inject = [];

    return NavbarItem;
});
