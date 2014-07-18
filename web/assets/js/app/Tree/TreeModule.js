define(
    [
        'angular',

        'app/Tree/component/service/RecursionHelper'
    ],
    function (
        angular,

        RecursionHelper
    ) {
        'use strict';

        var TreeModule = angular.module('tree', []);

        TreeModule.service('RecursionHelper', RecursionHelper);

        return TreeModule;
    }
);
