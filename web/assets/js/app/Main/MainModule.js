define(
    [
        'angular',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/NavbarController',

        'app/Main/component/service/JsonPatch',
        'app/Main/component/service/EventBridge',

        'app/Main/config/routing',
        'app/Main/config/loadLocales',

        'text!app/config.json',

        'angular-ui-router', 'angular-translate', 'angular-translate-storage-cookie'
    ],
    function (
        angular,

        AppController,
        NavbarController,

        JsonPatch,
        EventBridge,

        routing,

        loadLocales,

        config
    ) {
        'use strict';

        var MainModule = angular.module('main', [
            'ui.router',
            'pascalprecht.translate'
        ]);

        MainModule.controller('AppController', AppController);
        MainModule.controller('NavbarController', NavbarController);

        MainModule.service('JsonPatch', JsonPatch);
        MainModule.service('EventBridge', JsonPatch);

        MainModule.constant('config', JSON.parse(config));

        MainModule.config(routing);
        MainModule.config(loadLocales);

        return MainModule;
    }
);
