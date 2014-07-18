define(['angular'], function(angular) {
    'use strict';

    /**
     * ObjectMapper converts raw data into custom javascript object like Repository, Workspace or Node
     */
    function ObjectMapper($q, ApiFoundation, RepositoryFactory, WorkspaceFactory, NodeFactory) {
        this.$q = $q;
        this.ApiFoundation = ApiFoundation;
        this.RepositoryFactory = RepositoryFactory;
        this.WorkspaceFactory = WorkspaceFactory;
        this.NodeFactory = NodeFactory;
    }

    /**
     * Find a resource (repository, workspace or node)
     * find('/test') will search for test repository
     * find('/test/default') will search for default workspace in test repository
     * find('/test/default/node') will seach for node with /node as path in the default workspace in test repository
     * find('/') will return all repositories
     * find('/test/*') will return all workspaces in test repository
     * @param  {string} query
     * @param  {object} config
     * @return {promise}
    */
    ObjectMapper.prototype.find = function(query, config) {
        var self = this;
        if (!query) {
            return self.ApiFoundation.getRepositories(config).then(function(data) {
                var repositories = [];
                angular.forEach(data, function(repository) {
                    if (!self.RepositoryFactory.accept(repository)) {
                        return self.$q.reject('Invalid response');
                    }
                    repositories.push(self.RepositoryFactory.build(repository, self.find.bind(self)));
                });
                return repositories;
            });
        }

        if (query.slice(0,1) === '/') {
            query = query.slice(1);
        }

        var components = query.split('/');
        if (components.length === 1) {
            // Repository
            return self.ApiFoundation.getRepository(components[0], config).then(function(data) {
                if (!self.RepositoryFactory.accept(data)) {
                    return self.$q.reject('Invalid response');
                }
                return data;
            }).then(function(data) {
                return self.RepositoryFactory.build(data, self.find.bind(self));
            });

        } else if (components.length === 2) {
            return self.find('/' + components[0]).then(function(repository) {
                if (components[1] === '*') {
                    return self.ApiFoundation.getWorkspaces(components[0], config).then(function(data) {
                        var workspaces = [];
                        angular.forEach(data, function(workspace) {
                            if (!self.WorkspaceFactory.accept(workspace)) {
                                return self.$q.reject('Invalid response');
                            }

                            workspaces.push(self.WorkspaceFactory.build(workspace, repository, self.find.bind(self)));
                        });

                        return workspaces;
                    });
                }

                // Workspace
                return self.ApiFoundation.getWorkspace(components[0], components[1], config).then(function(data) {
                    if (!self.WorkspaceFactory.accept(data)) {
                        return self.$q.reject('Invalid response');
                    }
                    return data;
                }).then(function(data) {
                    return self.WorkspaceFactory.build(data, repository, self.find.bind(self));
                });
            });

        } else if (components.length > 2) {
            // Node
            var path = '/' + components.slice(2).join('/');
            return self.ApiFoundation.getNode(components[0], components[1], path, config).then(function(data) {
                if (!self.NodeFactory.accept(data)) {
                    return self.$q.reject('Invalid response');
                }
                return data;
            }).then(function(data) {
                return self.find('/' + components[0] + '/' + components[1]).then(function(workspace) {
                    return self.NodeFactory.build(data, workspace, self.find.bind(self));
                });
            });
        } else {
            return self.$q.reject('Invalid query');
        }
    };

    ObjectMapper.$inject = ['$q', 'ApiFoundation', 'RepositoryFactory','WorkspaceFactory','NodeFactory'];

    return ObjectMapper;
});
