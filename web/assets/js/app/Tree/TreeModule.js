define(
    [
        'angular',

        'app/Tree/component/service/RecursionHelper',
        'app/Tree/component/service/TreeCache',
        'app/Tree/component/service/TreeFactory',
        'app/Tree/component/service/RichTreeFactory',

        'app/Tree/component/model/Tree',
        'app/Tree/component/model/RichTree'
    ],
    function (
        angular,

        RecursionHelper,
        TreeCache,
        TreeFactory,
        RichTreeFactory,

        Tree,
        RichTree
    ) {
        'use strict';

        var TreeModule = angular.module('tree', []);

        TreeModule.service('RecursionHelper', RecursionHelper);
        TreeModule.service('TreeCache', TreeCache);
        TreeModule.service('TreeFactory', TreeFactory);
        TreeModule.service('RichTreeFactory', RichTreeFactory);

        TreeModule.service('Tree', Tree);
        TreeModule.service('RichTree', RichTree);

        return TreeModule;
    }
);
