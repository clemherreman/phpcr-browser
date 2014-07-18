define(
    [
        'angular',

        'app/Browser/component/controller/RepositoriesController',
        'app/Browser/component/controller/RepositoryController',

        'app/Browser/component/directive/Draggable',
        'app/Browser/component/directive/Droppable',
        'app/Browser/component/directive/Dropper',

        'app/Browser/component/filter/JaroWinkler',

        'app/Browser/config/routing',

        'angular-ui-router'
    ],
    function (
        angular,

        RepositoriesController,
        RepositoryController,

        Draggable,
        Droppable,
        Dropper,

        JaroWinkler,

        routing
    ) {
        'use strict';

        var BrowserModule = angular.module('browser', [
            'ui.router'
        ]);

        BrowserModule.controller('RepositoriesController', RepositoriesController);
        BrowserModule.controller('RepositoryController', RepositoryController);

        BrowserModule.directive('draggable', Draggable);
        BrowserModule.directive('droppable', Droppable);
        BrowserModule.directive('dropper', Dropper);

        BrowserModule.filter('JaroWinkler', JaroWinkler);

        BrowserModule.config(routing);

        return BrowserModule;
    }
);
