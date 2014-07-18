define([
    'text!../view/repositories.html',
    'text!../view/repository.html',
    'text!../view/workspace.html',
    'text!../view/node.html'
], function (repositoriesTemplate, repositoryTemplate, workspaceTemplate, nodeTemplate) {
    "use strict";

    function routing($stateProvider) {
        var firstLoad = true;

        $stateProvider
            .state('repositores', {
                'parent': 'main',
                'url': '/',
                'controller': 'RepositoriesController',
                'controllerAs': 'repositoriesController',
                'template': repositoriesTemplate
            })
            .state('repository', {
                'parent': 'main',
                'url': '/:repository',
                'resolve': {
                    'repository': ['$rootScope', '$stateParams', 'ObjectMapper', function($rootScope, $stateParams, ObjectMapper) {
                        $rootScope.$emit('browser.load');
                        return ObjectMapper.find('/' + $stateParams.repository).then(function(repository) {
                            $rootScope.$emit('browser.loaded');
                            return repository;
                        });
                    }]
                },
                'template': repositoryTemplate,
                'controller' : 'RepositoryController',
                'controllerAs' : 'repositoryController'
            })
            .state('workspace', {
                parent: 'main',
                abstract: true,
                url: '/:repository/:workspace',
                template: workspaceTemplate,
                controller: 'WorkspaceController'
            })
            .state('node', {
                parent: 'workspace',
                url: '{path:(?:/.*)?}',
                resolve: {
                    node: ['$rootScope', '$q', '$stateParams', 'ObjectMapper', 'TreeCache', function($rootScope, $q, $stateParams, ObjectMapper, TreeCache) {
                        var path = ($stateParams.path) ? $stateParams.path : '/',
                            params = {};

                        if (firstLoad) {
                            $rootScope.$emit('browser.load');
                            params = {
                                reducedTree: true,
                                cache: false
                            };
                        }


                        return ObjectMapper.find('/' + $stateParams.repository + '/' + $stateParams.workspace + path, params).then(function(node) {
                            if (firstLoad) {
                                firstLoad = false;
                                TreeCache.buildRichTree(node).then(function() {
                                    $rootScope.$emit('browser.loaded');
                                });
                            }

                            return node;
                        });
                    }]
                },
                template: nodeTemplate,
                controller: 'NodeController'
            });
    }

    routing.$inject = ['$stateProvider'];

    return routing;
});
