define([], function() {
    'use strict';

    /**
     * The RichTreeFactory is a factory to build RichTree object which are Tree object with some preconfigured hook listeners.
     */
    function RichTreeFactory(RichTree, TreeFactory) {
        this.RichTree = RichTree;
        this.TreeFactory = TreeFactory;
    }


    /**
     * Build a RichTree object
     * @param  {object} tree
     * @param  {Repository} repository
     * @param  {array} hooks
     * @return {RichTree}
     */
    RichTreeFactory.prototype.build = function(tree, repository, hooks) {
        return this.RichTree.create(tree, repository, hooks);
    };

      /**
       * Test raw data validity
       * @param  {object} data
       * @return {boolean}
       */
    RichTreeFactory.prototype.accept = function(data) {
        return this.TreeFactory.accept(data);
    };

    RichTreeFactory.$inject = ['RichTree', 'TreeFactory'];

    return RichTreeFactory;
});
