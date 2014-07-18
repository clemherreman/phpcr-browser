define([], function () {
    "use strict";

    function configureApi(ApiFoundationProvider, config) {
        ApiFoundationProvider.setServer(config.api.server);
        ApiFoundationProvider.setRepositoriesPrefix(config.api.prefixes.repositories);
        ApiFoundationProvider.setWorkspacesPrefix(config.api.prefixes.workspaces);
        ApiFoundationProvider.setNodesPrefix(config.api.prefixes.nodes);
    }

    configureApi.$inject = ['ApiFoundationProvider', 'config'];

    return configureApi;
});

