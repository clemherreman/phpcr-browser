/* global define */

define([], function() {
    'use strict';
    /**
     * EventBridge is in charge of broadcasting some custom events and forwarding some ones.
    */
    function EventBridge($rootScope) {
        this.$rootScope = $rootScope;

        this.$rootScope.$on('$stateChangeSuccess', this.onStateChangeSuccess.bind(this));
        this.$rootScope.$on('$stateChangeStart', this.onStateChangeStart.bind(this));
        this.$rootScope.$on('browser.load', this.onBrowserLoad.bind(this));
        this.$rootScope.$on('browser.loaded', this.onBrowserLoad.bind(this));
        this.$rootScope.$on('_search.change', this.onSearchChange.bind(this));
        this.$rootScope.$on('_tree.toggle', this.onTreeToggle.bind(this));
    }

    EventBridge.prototype.onStateChangeSuccess = function(evt, toState, toParams, fromState, fromParams) {
        if (toState.parent === 'workspace' && fromState.parent !== 'workspace') {
            // open a workspace coming from repositories ou repository route
            this.$rootScope.$broadcast('workspace.open.success', toParams.repository, toParams.workspace);
        } else if(toState.parent === 'workspace' && toState.name === fromState.name &&
            (toParams.repository !== fromParams.repository ||
            toParams.workspace !== fromParams.workspace)) {
            // open a workspace coming from another workspace
            this.$rootScope.$broadcast('workspace.open.success', toParams.repository, toParams.workspace);
        } else if(toState.name === fromState.name &&
            (toParams.repository !== fromParams.repository ||
            toParams.workspace !== fromParams.workspace)) {
            // open a repository
            this.$rootScope.$broadcast('repository.open.success', toParams.repository, toParams.workspace);
        } else if(toState.name === fromState.name &&
            toState.name === 'node' &&
            toParams.repository === fromParams.repository &&
            toParams.workspace === fromParams.workspace &&
            toParams.path !== fromParams.path) {
            // open a node in a workspace
            this.$rootScope.$broadcast('node.open.success', toParams.repository, toParams.workspace, toParams.path);
        }
    };

    EventBridge.prototype.onStateChangeStart = function(evt, toState, toParams, fromState, fromParams){
        if (toState.parent === 'workspace' && fromState.parent !== 'workspace') {
            // open a workspace coming from repositories ou repository route
            this.$rootScope.$broadcast('workspace.open.start', toParams.repository, toParams.workspace);
        } else if(toState.parent === 'workspace' && toState.name === fromState.name &&
            (toParams.repository !== fromParams.repository ||
            toParams.workspace !== fromParams.workspace)) {
            // open a workspace coming from another workspace
            this.$rootScope.$broadcast('workspace.open.start', toParams.repository, toParams.workspace);
        } else if(toState.name === fromState.name &&
            (toParams.repository !== fromParams.repository ||
            toParams.workspace !== fromParams.workspace)) {
            // open a repository
            this.$rootScope.$broadcast('repository.open.start', toParams.repository, toParams.workspace);
        } else if(toState.name === fromState.name &&
            toState.name === 'node' &&
            toParams.repository === fromParams.repository &&
            toParams.workspace === fromParams.workspace &&
            toParams.path !== fromParams.path) {
            // open a node in a workspace
            this.$rootScope.$broadcast('node.open.start', toParams.repository, toParams.workspace, toParams.path);
        }
    };

    EventBridge.prototype.onBrowserLoad = function() {
        this.$rootScope.$broadcast('_browser.load');
    };

    EventBridge.prototype.onBrowserLoaded = function() {
        this.$rootScope.$broadcast('_browser.loaded');
    };

    EventBridge.prototype.onSearchChange = function() {
        this.$rootScope.$broadcast('search.change');
    };

    EventBridge.prototype.onTreeToggle = function() {
        this.$rootScope.$broadcast('tree.toggle');
    };

    EventBridge.$inject = ['$rootScope'];
});
