define([], function () {
    "use strict";

    function configureApi(RestangularProvider, ApiFoundationProvider, config) {
        ApiFoundationProvider.setServer(config.api.server);
        ApiFoundationProvider.setRepositoriesPrefix(config.api.prefixes.repositories);
        ApiFoundationProvider.setWorkspacesPrefix(config.api.prefixes.workspaces);
        ApiFoundationProvider.setNodesPrefix(config.api.prefixes.nodes);

        RestangularProvider.setDefaultHttpFields({cache: true});
    }

    configureApi.$inject = ['RestangularProvider', 'ApiFoundationProvider', 'config'];

    return configureApi;
});

