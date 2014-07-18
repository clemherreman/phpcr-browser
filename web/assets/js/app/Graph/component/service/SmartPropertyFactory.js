define([], function() {
    'use strict';

    /**
     * SmartProperty constructor
     * @param {object} property
     * @param {Node} node
     */
    var SmartProperty = function(property, node) {
        this._property = property;
        this._node = node;
    };

    /**
     * Get the name of the property
     * @return {string}
     */
    SmartProperty.prototype.getName = function() {
        return this._property.name;
    };

    /**
     * Get the type of the property
     * @return {int}
     */
    SmartProperty.prototype.getType = function() {
        return this._property.type;
    };

    /**
     * Set the type of the property
     * @param {int} type
     * @return {promise}
     */
    SmartProperty.prototype.setType = function(type) {
        var self = this;
        return this._node.setProperty(this.getName(), this._property.value, type).then(function(data) {
            self._property.type = type;
            return data;
        });
    };

    /**
     * Get the value of the property
     * @param  {string} path
     * @return {promise}
     */
    SmartProperty.prototype.getValue = function(path) {
        var self = this;
        if (!path || path === '/') {
            return SmartPropertyFactory.$q.when(this._property.value);
        }

        var patchedValue = SmartPropertyFactory.JsonPatch.get(self._property.value, path);
        return SmartPropertyFactory.$q.when(patchedValue);
    };

    /**
     * Set value of the property
     * @param {mixed} value
     * @return {promise}
     */
    SmartProperty.prototype.setValue = function(value) {
        var self = this;
        return this._node.setProperty(this.getName(), value, this.getType()).then(function(data) {
            self._property.value = value;
            return data;
        });
    };

    /**
     * Insert a sub value in the property value
     * @param  {string} path
     * @param  {mixed} value
     * @return {promise}
     */
    SmartProperty.prototype.insert = function(path, value) {
        if (!path || path === '/') {
            return this.setValue(value);
        }

        var self = this;
        var patchedValue = SmartPropertyFactory.JsonPatch.insert(self._property.value, path, value);
        return self.setValue(patchedValue);
    };

    /**
     * Update a sub value in the property value
     * @param  {string} path
     * @param  {mixed} value
     * @return {promise}
     */
    SmartProperty.prototype.update = function(path, value) {
        if (!path || path === '/') {
            return this.setValue(value);
        }

        var self = this;
        var patchedValue = SmartPropertyFactory.JsonPatch.update(self._property.value, path, value);
        return self.setValue(patchedValue);
    };

    /**
     * Delete a sub value in the property value
     * @param  {string} path
     * @return {promise}
     */
    SmartProperty.prototype.delete = function(path) {
        if (!path || path === '/') {
            return this._node.deleteProperty(this.getName());
        }

        var self = this;
        var patchedValue = SmartPropertyFactory.JsonPatch.delete(self._property.value, path);
        return self.setValue(patchedValue);
    };

    /**
     * SmartPropertyFactory is a factory to build SmartProperty object which are json object with patching features.
     */
    function SmartPropertyFactory($q, JsonPatch) {
        SmartPropertyFactory.$q = $q;
        SmartPropertyFactory.JsonPatch = JsonPatch;
    }

    /**
     * Build a SmartProperty object
     * @param  {object} property
     * @param  {Node} node
     * @return {SmartProperty}
    */
    SmartPropertyFactory.prototype.build = function(property, node) {
        return new SmartProperty(property, node);
    };

    /**
     * Test raw data validity
     * @param  {object} data
     * @return {boolean}
     */
    SmartPropertyFactory.prototype.accept = function(data) {
        return data.name !== undefined && data.type !== undefined && data.value !== undefined;
    };

    SmartPropertyFactory.$inject = ['$q', 'JsonPatch'];

    return SmartPropertyFactory;
});
