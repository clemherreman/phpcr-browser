/* global define */

define([
  'jsonpatch'
], function(JSONPatch) {
    'use strict';

    /**
    * JsonPatch is an Angular integration fo JSONPatch library to manipulate JSON
    */
    function JsonPatch () {


    }

    /**
     * Update a json value
     * @param  {object} datum
     * @param  {string} path
     * @param  {mixed} value
     * @return {object}
    */
    JsonPatch.prototype.update = function(datum, path, value) {
        var _patch = [{ 'op': 'replace', 'path': path, 'value': value }];
        return JSONPatch.apply_patch(datum, _patch);
    };

    /**
     * Delete a value in a json
     * @param  {object} datum
     * @param  {string} path
     * @return {objet}
    */
    JsonPatch.prototype.delete = function(datum, path) {
        var _patch = [{ 'op': 'remove', 'path': path }];
        return JSONPatch.apply_patch(datum, _patch);
    };

    /**
     * Insert a value in a json
     * @param  {object} datum
     * @param  {string} path
     * @param  {mixed} value
     * @return {objet}
    */
    JsonPatch.prototype.insert = function(datum, path, value) {
        var _patch = [{ 'op': 'add', 'path': path, 'value': value }];
        return JSONPatch.apply_patch(datum, _patch);
    };


    /**
     * Get a json value
     * @param  {object} datum
     * @param  {string} path
     * @return {mixed}
    */
    JsonPatch.prototype.get = function(datum, path) {
        if (path === '/') { return datum; }
        path = path.split('/');
        path.shift();

        for (var i in datum) {
          if (i === path[0]) {
            path.shift();
            path = '/' + path.join('/');
            return this.get(datum[i], path);
          }
        }
        return null;
    };

    JsonPatch.$inject = [];

    return JsonPatch;
});
