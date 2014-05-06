/* global define */
/* jshint indent:2 */

define([
  'app',
  'services/api-foundation'
], function(app) {
  'use strict';

  app.factory('mbWorkspaceFactory', ['$q', 'mbApiFoundation', function($q, ApiFoundation) {

    var Workspace = function(workspace, repository, finder) {
      this._restangular = workspace;
      this._repository = repository;
      this._finder = finder;
    };

    Workspace.prototype.getName = function() {
      return this._restangular.name;
    };

    Workspace.prototype.getRepository = function() {
      return this._repository;
    };

    Workspace.prototype.getNode = function(path, params) {
      if (!path) { path = '/'; }
      return this._finder('/' + this.getRepository().getName() + '/' + this.getName() + path, params);
    };

    Workspace.prototype.getSlug = function() {
      return this.getName().replace(' ', '_');
    };

    Workspace.prototype.delete = function() {
      return ApiFoundation.deleteWorkspace(this.getRepository().getName(), this.getName());
    };

    Workspace.prototype.create = function() {
      if (/^[a-zA-z][0-9a-zA-z]*$/.test(this.getName())) {
        return ApiFoundation.createWorkspace(this.getRepository().getName(), this.getName());
      }

      var deferred = $q.defer();
      deferred.reject('The name is not valid');
      return deferred.promise;
    };

    return {
      build: function(workspace, repository, finder) {
        return new Workspace(workspace, repository, finder);
      },
      accept: function(data) {
        return data.name !== undefined;
      }
    };
  }]);
});
