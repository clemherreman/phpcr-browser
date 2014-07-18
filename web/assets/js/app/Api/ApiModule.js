define(
    [
        'angular',

        'app/Api/component/service/ApiFoundation',

        'app/Api/config/configureApi',

        'restangular'
    ],
    function (
        angular,

        ApiFoundation,

        configureApi
    ) {
        'use strict';

        var ApiModule = angular.module('api', ['restangular']);

        ApiModule.provider('ApiFoundation', ApiFoundation);

        ApiModule.config(configureApi);

        return ApiModule;
    }
);
