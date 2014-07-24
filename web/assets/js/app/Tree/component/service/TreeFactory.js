define([], function() {
    'use strict';

    /**
    * TreeFactory is a factory to build Tree which expose append/move/delete/refresh features.
    */

    function TreeFactory(Tree) {
        this.Tree = Tree;
    }

    /**
     * Build a Tree object
     * @param  {object} tree
     * @param  {array} hooks
     * @return {promise}
     */
    TreeFactory.prototype.build = function(tree, hooks) {
        return this.Tree.create(tree, hooks);
    };

    /**
     * Test raw data validity
     * @param  {object} data
     * @return {boolean}
     */
    TreeFactory.prototype.accept = function(data) {
        return data.name !== undefined && data.path !== undefined && data.children !== undefined;
    };

    TreeFactory.$inject = ['Tree'];

    return TreeFactory;
});
