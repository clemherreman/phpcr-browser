define(
    [
        'angular',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/NavbarController',
        'app/Main/component/controller/NavbarItemController',

        'app/Main/component/service/JsonPatch',
        'app/Main/component/service/EventBridge',

        'app/Main/component/directive/NavbarItem',

        'app/Main/config/routing',
        'app/Main/config/loadLocales',
        'app/Main/config/loadRequestAnimationFrame',

        'app/Main/run/loadEventBridge',
        'app/Main/run/loadLogListeners',
        'app/Main/run/loadStateErrorListener',

        'text!app/config.json',

        'angular-ui-router', 'angular-translate', 'angular-translate-storage-cookie', 'angular-bootstrap-tpls', 'talker', 'angular-js-toaster'
    ],
    function (
        angular,

        AppController,
        NavbarController,
        NavbarItemController,

        JsonPatch,
        EventBridge,

        NavbarItem,

        routing,
        loadLocales,
        loadRequestAnimationFrame,

        loadEventBridge,
        loadLogListeners,
        loadStateErrorListener,

        config
    ) {
        'use strict';

        var MainModule = angular.module('main', [
            'ui.router',
            'pascalprecht.translate',
            'ui.bootstrap',
            'talker',
            'toaster',
        ]);

        MainModule.controller('AppController', AppController);
        MainModule.controller('NavbarController', NavbarController);
        MainModule.controller('NavbarItemController', NavbarItemController);

        MainModule.service('JsonPatch', JsonPatch);
        MainModule.service('EventBridge', EventBridge);

        MainModule.directive('navbarItem', NavbarItem);

        MainModule.constant('config', JSON.parse(config));

        MainModule.config(routing);
        MainModule.config(loadLocales);
        MainModule.config(loadRequestAnimationFrame);

        MainModule.run(loadEventBridge);
        MainModule.run(loadLogListeners);
        MainModule.run(loadStateErrorListener);

        return MainModule;
    }
);
