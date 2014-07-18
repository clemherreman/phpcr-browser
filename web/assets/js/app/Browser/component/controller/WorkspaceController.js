define([], function(app) {
    'use strict';

    function WorkspaceController($scope, $log, TreeCache, node) {
        this.$scope = $scope;
        this.$log = $log;
        this.TreeCache = TreeCache;
        this.node = node;
        this.workspace = this.node.getWorkspace();
        this.repository = this.workspace.getRepository();


        this.displayTree = false; // used in mobile mode

        var self = this;
        $scope.$on('search.change', function(e, value) {
            self.search = value;
        });

        $scope.$on('tree.toggle', function() {
            self.displayTree = !self.displayTree;
        });

        TreeCache.getRichTree().then(function(rt) {
            self.richTree = rt;
            self.$emit('browser.loaded');
        });
    }

    WorkspaceController.$inject = ['$scope', '$log', 'TreeCache', 'node'];

    return WorkspaceController;
});
