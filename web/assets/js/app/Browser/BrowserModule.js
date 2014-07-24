define(
    [
        'angular',

        'app/Browser/component/controller/RepositoriesController',
        'app/Browser/component/controller/RepositoryController',
        'app/Browser/component/controller/WorkspaceController',

        'app/Browser/component/directive/Draggable',
        'app/Browser/component/directive/Droppable',
        'app/Browser/component/directive/Dropper',
        'app/Browser/component/directive/Overlay',

        'app/Browser/component/filter/JaroWinkler',

        'app/Browser/config/routing',

        'angular-ui-router', 'angular-ui-util-keypress'
    ],
    function (
        angular,

        RepositoriesController,
        RepositoryController,
        WorkspaceController,

        Draggable,
        Droppable,
        Dropper,
        Overlay,

        JaroWinkler,

        routing
    ) {
        'use strict';

        var BrowserModule = angular.module('browser', [
            'ui.router',
            'ui.keypress'
        ]);

        BrowserModule.controller('RepositoriesController', RepositoriesController);
        BrowserModule.controller('RepositoryController', RepositoryController);
        BrowserModule.controller('WorkspaceController', WorkspaceController);

        BrowserModule.directive('draggable', Draggable);
        BrowserModule.directive('droppable', Droppable);
        BrowserModule.directive('dropper', Dropper);
        BrowserModule.directive('overlay', Overlay);

        BrowserModule.filter('JaroWinkler', JaroWinkler);

        BrowserModule.config(routing);

        return BrowserModule;
    }
);
