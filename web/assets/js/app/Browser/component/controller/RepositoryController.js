define([], function () {
    "use strict";

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    function RepositoryController($scope, $translate, $log, $state, repository, ObjectMapper, WorkspaceFactory) {
        this.$scope = $scope;
        this.$translate = $translate;
        this.$log = $log;
        this.$state = $state;

        this.repository = repository;
        this.WorkspaceFactory = WorkspaceFactory;
        this.displayCreateForm = false;

        var self = this;
        ObjectMapper.find('/' + repository.getName() + '/*').then(function(workspaces) {
            self.workspaces = workspaces;
        });

        $scope.$on('search.change', function(e, value) {
            self.search = value;
        });

        $scope.$on('drop', function(e, data) {
            e.stopPropagation();
            self.deleteWorkspace(data.elementDropped);
        });

        $scope.$on('$destroy', this.destroy.bind(this));

    }

    RepositoryController.prototype.createWorkspace = function(workspaceName) {
        if (!this.repository.supports('workspace.create')) {
            return this.$translate('WORKSPACE_NOT_SUPPORT_CREATE').then(this.$log.error, this.$log.error);
        }

        if (!workspaceName || workspaceName.trim().length === 0) {
            return this.$translate('WORKSPACE_CREATE_NAME_EMPTY').then(this.$log.error, this.$log.error);
        }

        var workspace = this.WorkspaceFactory.build(
            {
                name: workspaceName
            },
            this.repository
        );

        var self = this;
        workspace.create().then(function() {
            self.repository.getWorkspaces({ cache: false }).then(function(workspaces) {
                self.workspaces = workspaces;
                self.$translate('WORKSPACE_CREATE_SUCCESS')
                    .then(self.$log.log, self.$log.log)
                    .finally(function() {
                        self.displayCreateForm = false;
                    });
            });
        });
    };

    RepositoryController.prototype.showCreateForm = function() {
        this.displayCreateForm = true;
    };

    RepositoryController.prototype.hideCreateForm = function() {
        this.displayCreateForm = false;
    };

    RepositoryController.prototype.openWorkspace = function(workspace) {
        this.$state.go('node', {
            repository: workspace.getRepository().getName(),
            workspace: workspace
        });
        // .then(function(e) { console.log(e); }, function(e) { console.log(e); });
    };

    RepositoryController.prototype.deleteWorkspace = function(element) {
        if (!this.repository.supports('workspace.delete')) {
            return this.$translate('WORKSPACE_NOT_SUPPORT_DELETE').then(this.$log.error, this.$log.error);
        }

        var index;
        var workspace = this.workspaces.filter(function(workspace, key) {
            if (element.attr('id') === workspace.getSlug()) {
                index = key;
                return true;
            }
            return false;
        })[0];

        var self = this;
        workspace.delete().then(function() {
            self.$translate('WORKSPACE_DELETE_SUCCESS').then(self.$log.log, self.$log.log).finally(function() {
                delete self.workspaces[index];
            });
        });
    };

    RepositoryController.prototype.destroy = function() {
        this.$scope = undefined;
        this.workspaces = undefined;
    };

    RepositoryController.$inject = ['$scope', '$translate', '$log', '$state', 'repository', 'ObjectMapper', 'WorkspaceFactory'];

    return RepositoryController;
});
