define(['angular'], function(angular) {
    'use strict';
    /**
     * ApiFoundation is the lower layer of the phpcr-browser.
     * It transforms the basic actions in REST requests on the API
     */
    function ApiFoundation(provider, $q, $cacheFactory, $log, $translate, Restangular) {
        this.provider = provider;
        this.$q = $q;
        this.$cacheFactory = $cacheFactory;
        this.$log = $log;
        this.$translate = $translate;
        this.Restangular = Restangular;

        this.Restangular.setBaseUrl(provider.server);

        this.repositories    = this.Restangular.all(provider.repositoriesPrefix);
        this.repositoryCache = {};
        this.workspaceCache  = {};
        this.nodeCache       = {};
    }

    ApiFoundation.prototype.errorHandler = function(err) {
        this.provider.errorHandlerCallback(err, this.$log, this.$translate);
        return this.$q.reject(err);
    };

    /**
     * Build repository Restangular object and cache it
     * @param  {string} repository
     * @return {Restangular object}
     */
    ApiFoundation.prototype.repository = function(repository) {
        if (!this.repositoryCache[repository]) {
            this.repositoryCache[repository] = this.Restangular.one(this.provider.repositoriesPrefix, repository);
        }
        return this.repositoryCache[repository];
    };

    /**
     * Build workspaces Restangular object
     * @param  {string} repositoryName
     * @return {Restangular object}
     */
    ApiFoundation.prototype.workspaces = function(repositoryName) {
        return this.repository(repositoryName).all(this.provider.workspacesPrefix);
    };

    /**
     * Build workspace Restangular object and cache it
     * @param  {string} repositoryName
     * @param  {string} name
     * @return {Restangular object}
     */
    ApiFoundation.prototype.workspace = function(repositoryName, name) {
        if (!this.workspaceCache[repositoryName+'/'+name]) {
            this.workspaceCache[repositoryName+'/'+name] = this.repository(repositoryName).one(this.provider.workspacesPrefix, name);
        }
        return this.workspaceCache[repositoryName+'/'+name];
    };

    /**
    * Build node Restangular object and cache it
    * @param  {string} repositoryName
    * @param  {string} workspaceName
    * @param  {string} path
    * @return {Restangular object}
    */
    ApiFoundation.prototype.node = function(repositoryName, workspaceName, path) {
        if (!this.nodeCache[repositoryName+'/'+workspaceName+path]) {
            if (path.slice(0,1) === '/') {
                path = path.slice(1);
            }
            this.nodeCache[repositoryName+'/'+workspaceName+path] = this.workspace(repositoryName, workspaceName).one(this.nodesPrefix, path);
        }
        return this.nodeCache[repositoryName+'/'+workspaceName+path];
    };

    /**
     * Build nodes Restangular object
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @return {Restangular object}
     */
    ApiFoundation.nodeCollection = function(repositoryName, workspaceName, path) {
        if (path.slice(0,1) === '/') {
            path = path.slice(1);
        }
        return this.workspace(repositoryName, workspaceName).all(this.nodesPrefix).all(path);
    };

    /**
     * Build node properties Restangular object
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @return {Restangular object}
     */
    ApiFoundation.nodeProperties = function(repositoryName, workspaceName, path) {
        if (path.slice(0,1) === '/') {
            path = path.slice(1);
        }
        return this.workspace(repositoryName, workspaceName).all(this.nodesPrefix).all(path + '@properties');
    };

    /**
     * Build node property Restangular object
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} propertyName
     * @return {Restangular object}
     */
    ApiFoundation.prototype.nodeProperty = function(repositoryName, workspaceName, path, propertyName) {
        if (path.slice(0,1) === '/') {
            path = path.slice(1);
        }
        return this.workspace(repositoryName, workspaceName).all(this.nodesPrefix).one(path + '@properties', propertyName);
    };

    /**
     * Get server url
     * @return {string}
     */
    ApiFoundation.prototype.getServer = function() {
        return this.provider.server;
    };

    /**
     * Get repositories collection prefix
     * @return {string}
     */
    ApiFoundation.prototype.getRepositoriesPrefix = function() {
        return this.provider.repositoriesPrefix;
    };

    /**
     * Get workspaces collection prefix
     * @return {string}
     */
    ApiFoundation.prototype.getWorkspacesPrefix = function() {
        return this.provider.workspacesPrefix;
    };

    /**
     * Get nodes collection prefix
     * @return {string}
     */
    ApiFoundation.prototype.getNodesPrefix = function() {
        return this.provider.nodesPrefix;
    };

    /**
     * Get all repositories
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.getRepositories = function(config) {
        config = config || {};

        if (config.cache !== undefined && !config.cache) {
            this.invalidateCacheEntry(this.repositories.getRequestedUrl());
            delete config.cache;
        }

        return this.repositories.withHttpConfig(config).getList().catch(this.errorHandler.bind(this));
    };

    /**
     * Get a repository
     * @param  {string} name
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.getRepository = function(name, config) {
        config = config || {};

        if (config.cache !== undefined && !config.cache) {
            this.invalidateCacheEntry(this.repository(name).getRequestedUrl());
            delete config.cache;
        }

        return this.repository(name).withHttpConfig(config).get().catch(this.errorHandler.bind(this));
    };

    /**
     * Get all workspaces in a repository
     * @param  {string} repositoryName
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.getWorkspaces = function(repositoryName, config) {
        config = config || {};

        if (config.cache !== undefined && !config.cache) {
            this.invalidateCacheEntry(this.workspaces(repositoryName).getRequestedUrl());
            delete config.cache;
        }

        return this.workspaces(repositoryName).withHttpConfig(config).getList().catch(this.errorHandler.bind(this));
    };

    /**
     * Get a workspace in a repository
     * @param  {string} repositoryName
     * @param  {string} name
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.getWorkspace = function(repositoryName, name, config) {
        config = config || {};

        if (config.cache !== undefined && !config.cache) {
            this.invalidateCacheEntry(this.workspace(repositoryName, name).getRequestedUrl());
            delete config.cache;
        }

        return this.workspace(repositoryName, name).withHttpConfig(config).get().catch(this.errorHandler.bind(this));
    };

    /**
     * Create a workspace in a repository
     * @param  {string} repositoryName
     * @param  {string} name
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.createWorkspace = function(repositoryName, name, config) {
        config = config || {};
        return this.workspaces(repositoryName).withHttpConfig(config).post({ name: name }).catch(this.errorHandler.bind(this));
    };

    /**
     * Delete a workspace in a repository
     * @param  {string} repositoryName
     * @param  {string} name
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.deleteWorkspace = function(repositoryName, name, config) {
        config = config || {};
        return this.workspace(repositoryName, name).withHttpConfig(config).remove().catch(this.errorHandler.bind(this));
    };

    /**
     * Get a node in a workspace
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.getNode = function(repositoryName, workspaceName, path, config) {
        config = config || {};
        var params;
        if (config.reducedTree) {
            params = { reducedTree: true };
            delete config.reducedTree;
        } else{
            params = {};
        }

        if (config.cache !== undefined && !config.cache) {
            this.invalidateCacheEntry(this.node(repositoryName, workspaceName, path).getRequestedUrl());
            delete config.cache;
        }

        return this.node(repositoryName, workspaceName, path).withHttpConfig(config).get(params).catch(this.errorHandler.bind(this));
    };

    /**
     * Create a node in a workspace
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} parentPath
     * @param  {string} relPath
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.createNode = function(repositoryName, workspaceName, parentPath, relPath, config) {
        config = config || {};
        return this.nodeCollection(repositoryName, workspaceName, parentPath).withHttpConfig(config).post({ relPath: relPath}).catch(this.errorHandler.bind(this));
    };

    /**
     * Delete a node in a workspace
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.deleteNode = function(repositoryName, workspaceName, path, config) {
        config = config || {};
        return this.node(repositoryName, workspaceName, path).withHttpConfig(config).remove().catch(this.errorHandler.bind(this));
    };

    /**
     * Move a node in a workspace
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} newPath
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.moveNode = function(repositoryName, workspaceName, path, newPath, config) {
        config = config || {};
        return this.node(repositoryName, workspaceName, path).withHttpConfig(config).put({
            method:      'move',
            destAbsPath: newPath
        }).catch(this.errorHandler.bind(this));
    };

    /**
     * Rename a node in a workspace
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} newName
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.renameNode = function(repositoryName, workspaceName, path, newName, config) {
        config = config || {};
        return this.node(repositoryName, workspaceName, path).withHttpConfig(config).put({
            method: 'rename',
            newName: newName
        }).catch(this.errorHandler.bind(this));
    };

    /**
     * Create a property in a node
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} propertyName
     * @param  {mixed} propertyValue
     * @param  {int} propertyType
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.createNodeProperty = function(repositoryName, workspaceName, path, propertyName, propertyValue, propertyType, config) {
        config = config || {};
        if (propertyType) {
            return this.nodeProperties(repositoryName, workspaceName, path).withHttpConfig(config).post({ name: propertyName, value: propertyValue, type: propertyType }).catch(this.errorHandler.bind(this));
        }
        return this.nodeProperties(repositoryName, workspaceName, path).withHttpConfig(config).post({ name: propertyName, value: propertyValue }).catch(this.errorHandler.bind(this));
    };

    /**
     * Delete a property in a node
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} propertyName
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.deleteNodeProperty = function(repositoryName, workspaceName, path, propertyName, config) {
        config = config || {};
        return this.nodeProperty(repositoryName, workspaceName, path, propertyName).withHttpConfig(config).remove().catch(this.errorHandler.bind(this));
    };

    /**
     * Update a property in a node
     * @param  {string} repositoryName
     * @param  {string} workspaceName
     * @param  {string} path
     * @param  {string} propertyName
     * @param  {mixed} propertyValue
     * @param  {int} propertyType
     * @param  {object} config
     * @return {promise}
     */
    ApiFoundation.prototype.updateNodeProperty = function(repositoryName, workspaceName, path, propertyName, propertyValue, propertyType, config) {
        config = config || {};
        return this.nodeProperties(repositoryName, workspaceName, path).withHttpConfig(config).post({ name: propertyName, value: propertyValue, type: propertyType }).catch(this.errorHandler.bind(this));
    };

    /**
     * Invalidate an entry in the http cache
     * @param  {string} key
     */
    ApiFoundation.prototype.invalidateCacheEntry = function(key) {
        this.$cacheFactory.get('$http').remove(key);
    };

    function ApiFoundationProvider() {
        this.server = null;
        this.repositoriesPrefix = null;
        this.workspacesPrefix = null;
        this.nodesPrefix = null;
        this.errorHandlerCallback = angular.noop;
        this.errorHandler = null;
    }

    ApiFoundationProvider.prototype.$get = ['$injector', function($injector) {
        return $injector.instantiate(ApiFoundation, {
            'provider': this
        });
    }];

    /**
     * Configure server url
     * @param {string} value
     */
    ApiFoundationProvider.prototype.setServer = function(value) {
        this.server = value;
    };

    /**
     * Configure repositories collection prefix in url
     * @param {string} value
     */
    ApiFoundationProvider.prototype.setRepositoriesPrefix = function(value) {
        this.repositoriesPrefix = value;
    };

    /**
     * Configure workspaces collection prefix in url
     * @param {string} value
     */
    ApiFoundationProvider.prototype.setWorkspacesPrefix = function(value) {
        this.workspacesPrefix = value;
    };

    /**
     * Configure nodes collection prefixe in url
     * @param {string} value
     */
    ApiFoundationProvider.prototype.setNodesPrefix = function(value) {
        this.nodesPrefix = value;
    };

    /**
     * Configure the error handler
     * @param {Function} handler
     */
    ApiFoundationProvider.prototype.setErrorHandler = function(handler) {
        this.errorHandlerCallback = handler;
    };

    return ApiFoundationProvider;
});
