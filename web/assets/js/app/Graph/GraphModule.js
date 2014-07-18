define(
    [
        'angular',

        'app/Graph/component/service/NodeFactory',
        'app/Graph/component/service/RepositoryFactory',
        'app/Graph/component/service/WorkspaceFactory',
        'app/Graph/component/service/SmartPropertyFactory',
        'app/Graph/component/service/ObjectMapper'
    ],
    function (
        angular,

        NodeFactory,
        RepositoryFactory,
        WorkspaceFactory,
        SmartPropertyFactory,
        ObjectMapper
    ) {
        'use strict';

        var GraphModule = angular.module('graph', []);

        GraphModule.service('NodeFactory', NodeFactory);
        GraphModule.service('RepositoryFactory', RepositoryFactory);
        GraphModule.service('WorkspaceFactory', WorkspaceFactory);
        GraphModule.service('SmartPropertyFactory', SmartPropertyFactory);
        GraphModule.service('ObjectMapper', ObjectMapper);

        return GraphModule;
    }
);
