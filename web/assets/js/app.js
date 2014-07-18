require(['vendor', 'phpcr-browser'], function () {
    'use strict';

    require(['angular', 'MainModule', 'BrowserModule', 'MenuModule', 'GraphModule', 'ApiModule', 'TreeModule'], function (angular) {

        angular.module(

            // application name
            'phpcr-browser',

            // application dependencies
            ['main', 'browser', 'menu', 'graph', 'api', 'tree'],

            // global default redirection
            ['$urlRouterProvider', function($urlRouterProvider) {
                $urlRouterProvider.otherwise('/');
            }]

        );

        angular.bootstrap(document.body, ['phpcr-browser']);
    });
});
