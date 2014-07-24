define(['angular'], function(angular) {
    'use strict';

    /**
     * MenuBuilderFactory provides builders for Menu.
     */
    function MenuBuilderFactory($rootScope, $translate, ObjectMapper) {
        this.$rootScope = $rootScope;
        this.$translate = $translate;
        this.ObjectMapper = ObjectMapper;

        this.repositoriesLabel = 'MENU_REPOSITORIES';

        this.loadLocale();
        this.$rootScope.$on('$translateChangeSuccess',this.loadLocale.bind(this));

        this.loadBuilders();
    }

    MenuBuilderFactory.prototype.loadLocale = function() {
        var self = this;
        this.$translate('MENU_REPOSITORIES').then(function(translation) {
            self.repositoriesLabel = translation;
        }, function(err) {
            self.repositoriesLabel = err;
        });
    };

    MenuBuilderFactory.prototype.loadBuilders = function() {
        var self = this;

        this.builders = {
            /**
            * Repositories menu link builder
            * @param  {Function} callback
            */
            'repositories': function(callback) {
                self.ObjectMapper.find().then(function(repositories) {
                    var link = {
                        label: self.repositoriesLabel,
                        sublinks: []
                    };
                    angular.forEach(repositories, function(repository) {
                        link.sublinks.push({
                            label: repository.getName(),
                            state: 'repository',
                            params: {
                                repository: repository.getName()
                            }
                        });
                    });
                    callback(link);
                });
            },

            /**
            * Repository menu link builder
            * @param  {Function} callback
            */
            'repository': ['repositories', function(callback) {
                var repository = self.$rootScope.currentRepository ? self.$rootScope.currentRepository : self.$rootScope.currentNode.getWorkspace().getRepository();
                repository.getWorkspaces().then(function(workspaces) {
                    var link = {
                        label: repository.getName(),
                        sublinks: []
                    };

                    angular.forEach(workspaces, function(workspace) {
                        link.sublinks.push({
                            label: workspace.getName(),
                            state: 'node',
                            params: {
                                repository: repository.getName(),
                                workspace: workspace.getName()
                            }
                        });
                    });

                    callback(link);
                });
            }],

            /**
            * Node menu link builder
            * @param  {Function} callback
            */
            'node': ['repository', function(callback) {
                var workspace = self.$rootScope.currentNode.getWorkspace();
                var link = {
                    label: workspace.getName(),
                    state: 'node',
                    params: {
                        repository: workspace.getRepository().getName(),
                        workspace: workspace.getName()
                    }
                };

                callback(link);
            }]
        };
    };

    /**
     * Generate a normalized builder object
     * @param  {string} name
     * @return {object}
     */
    MenuBuilderFactory.prototype.callbackFactory = function(name) {
        var self = this;
        return {
            name: name,
            builder: self.builders[name]
        };
    };

    MenuBuilderFactory.prototype.getRepositoriesBuilder = function() {
        return this.callbackFactory('repositories');
    };

    MenuBuilderFactory.prototype.getRepositoryBuilder = function() {
        return this.callbackFactory('repository');
    };

    MenuBuilderFactory.prototype.getNodeBuilder = function() {
        return this.callbackFactory('node');
    };

    MenuBuilderFactory.$inject = ['$rootScope', '$translate', 'ObjectMapper'];

    return MenuBuilderFactory;
});
