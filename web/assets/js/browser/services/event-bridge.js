/* global define */
/* jshint indent:2 */

define([
  'app'
], function(app) {
  'use strict';

  /**
   * EventBridge is in charge of broadcasting some custom events and forwarding some ones.
   */
  app.service('mbEventBridge', ['$rootScope', function($rootScope){

    /**
     * Forward browser.load event
     */
    $rootScope.$on('browser.load', function() {
      $rootScope.$broadcast('_browser.load');
    });

    /**
     * Forward browser.loaded event
     */
    $rootScope.$on('browser.loaded', function() {
      $rootScope.$broadcast('_browser.loaded');
    });

    /**
     * Forward search query
     */
    $rootScope.$on('_search.change', function(e, value) {
      $rootScope.$broadcast('search.change', value);
    });

    /**
     * Forward search query
     */
    $rootScope.$on('_tree.toggle', function(e, value) {
      $rootScope.$broadcast('tree.toggle', value);
    });

    /**
     * Broadcast repository.open.success, workspace.open.success, node.open.success events
     */
    $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams){
      if (toState.parent === 'workspace' && fromState.parent !== 'workspace') {
        // open a workspace coming from repositories ou repository route
        $rootScope.$broadcast('workspace.open.success', toParams.repository, toParams.workspace);
      } else if(toState.parent === 'workspace' && toState.name === fromState.name &&
        (toParams.repository !== fromParams.repository ||
        toParams.workspace !== fromParams.workspace)) {
        // open a workspace coming from another workspace
        $rootScope.$broadcast('workspace.open.success', toParams.repository, toParams.workspace);
      } else if(toState.name === fromState.name &&
        (toParams.repository !== fromParams.repository ||
        toParams.workspace !== fromParams.workspace)) {
        // open a repository
        $rootScope.$broadcast('repository.open.success', toParams.repository, toParams.workspace);
      } else if(toState.name === fromState.name &&
        toState.name === 'node' &&
        toParams.repository === fromParams.repository &&
        toParams.workspace === fromParams.workspace &&
        toParams.path !== fromParams.path) {
        // open a node in a workspace
        $rootScope.$broadcast('node.open.success', toParams.repository, toParams.workspace, toParams.path);
      }
    });

    /**
     * Broadcast repository.open.start, workspace.open.start, node.open.start events
     */
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams){
      if (toState.parent === 'workspace' && fromState.parent !== 'workspace') {
        // open a workspace coming from repositories ou repository route
        $rootScope.$broadcast('workspace.open.start', toParams.repository, toParams.workspace);
      } else if(toState.parent === 'workspace' && toState.name === fromState.name &&
        (toParams.repository !== fromParams.repository ||
        toParams.workspace !== fromParams.workspace)) {
        // open a workspace coming from another workspace
        $rootScope.$broadcast('workspace.open.start', toParams.repository, toParams.workspace);
      } else if(toState.name === fromState.name &&
        (toParams.repository !== fromParams.repository ||
        toParams.workspace !== fromParams.workspace)) {
        // open a repository
        $rootScope.$broadcast('repository.open.start', toParams.repository, toParams.workspace);
      } else if(toState.name === fromState.name &&
        toState.name === 'node' &&
        toParams.repository === fromParams.repository &&
        toParams.workspace === fromParams.workspace &&
        toParams.path !== fromParams.path) {
        // open a node in a workspace
        $rootScope.$broadcast('node.open.start', toParams.repository, toParams.workspace, toParams.path);
      }
    });
  }]);
});
