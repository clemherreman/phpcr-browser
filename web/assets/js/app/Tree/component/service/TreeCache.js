define([
], function() {
    'use strict';

    /**
    * The TreeCache aims to stored a shared RichTree during a session to avoid to always rebuild it.
    */
    function TreeCache($q, $rootScope, Tree, RichTreeFactory, TreeFactory, NodeFactory, ObjectMapper) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.Tree = Tree;
        this.RichTreeFactory = RichTreeFactory;
        this.TreeFactory = TreeFactory;
        this.NodeFactory = NodeFactory;
        this.ObjectMapper = ObjectMapper;

        this.buildHookListeners();
    }

    TreeCache.prototype.buildHookListeners = function() {
        var self = this;
        this.hooks = [
            {
                event: self.Tree.HOOK_PRE_REFRESH,

                /**
                 * Listener on pre refresh hook to perform the refresh over the REST API
                 * @param  {Function} next
                 * @param  {string}   path
                 * @param  {object}   node
                 */
                callback: function(next, path, node) {
                    if (!node.collapsed) {
                        return next();
                    }

                    self.ObjectMapper.find(self.repository.getName() + '/' + self.workspace.getName() + path, { cache: false }).then(function(_node) {
                        node.children = _node.getRawData().children;
                        next();
                    }, next);
                }
            },
            {
                event: self.Tree.HOOK_PRE_MOVE,

                /**
                 * Listener on pre move hook to perform the move over the REST API
                 * @param  {Function} next
                 * @param  {string}   fromPath
                 * @param  {string}   toPath
                 */
                callback: function(next, fromPath, toPath) {
                    self.ObjectMapper.find('/' + self.repository.getName() + '/' + self.workspace.getName() + fromPath).then(function(nodeDropped) {
                        nodeDropped.move(toPath).then(function() {
                            next();
                        }, next);
                    }, next);
                }
            },
            {
                event: self.Tree.HOOK_PRE_APPEND,

                /**
                 * Listener on pre append hook to perform the append over the REST API
                 * @param  {Function} next
                 * @param  {string}   parentPath
                 * @param  {object}   childNode
                 */
                callback: function(next, parentPath, childNode) {
                    self.NodeFactory.build(childNode, self.workspace).create().then(function() {
                        next();
                    }, next);
                }
            },
            {
                event: self.Tree.HOOK_PRE_REMOVE,

                /**
                 * Listener on pre remove hook to perform the remove over the REST API
                 * @param  {Function} next
                 * @param  {string}   path
                 * @return {Function}
                 */
                callback: function(next, path) {
                    self.ObjectMapper.find('/' + self.repository.getName() + '/' + self.workspace.getName() + path).then(function(node) {
                        node.delete().then(function() {
                            next();
                        }, next);
                    }, next);
                }
            }
        ];
    };

    /**
     * Build a RichTree object based on the current node and cache it
     * @return {promise}
     */
    TreeCache.prototype.buildRichTree = function(rootNode) {
        this.currentRootNode = rootNode;
        this.deferred = this.$q.defer();
        var self = this;
        // rich tree is not built, retrieve the current node with its reduced tree
        this.repository = rootNode.getWorkspace().getRepository();
        this.workspace = rootNode.getWorkspace();
        // build the rich tree
        return this.RichTreeFactory.build(
            rootNode.getReducedTree()[0],
            self.repository,
            this.hooks
        ).then(function(richTree) {
            // save the built rich tree
            self.deferred.resolve(richTree);
        });
    };

    /**
     * Get the RichTree stored in the cache
     * @return {promise}
     */
    TreeCache.prototype.getRichTree = function() {
        return this.deferred.promise;
    };

    /**
     * Get the current rootNode used to build the richTree
     * @return {Node}
     */
    var getCurrentRootNode = function() {
        return this.currentRootNode;
    };

    TreeCache.$inject = ['$q', '$rootScope', 'Tree', 'RichTreeFactory', 'TreeFactory', 'NodeFactory', 'ObjectMapper'];

    return TreeCache;
});
