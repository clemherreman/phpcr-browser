define(
    [
        'angular',

        'app/Menu/component/service/MenuBuilderFactory',
        'app/Menu/component/service/MenuContainer',

        'app/Menu/run/loadMenus'
    ],
    function (
        angular,

        MenuBuilderFactory,
        MenuContainer,

        loadMenus
    ) {
        'use strict';

        var MenuModule = angular.module('menu', []);

        MenuModule.service('MenuBuilderFactory', MenuBuilderFactory);
        MenuModule.service('MenuContainer', MenuContainer);

        MenuModule.run(loadMenus);

        return MenuModule;
    }
);
