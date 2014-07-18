define([], function () {
    "use strict";

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    function RepositoriesController($scope, $state, ObjectMapper) {
        this.$scope = $scope;
        this.$state = $state;

        var self = this;
        ObjectMapper.find().then(function(repositories) {
            self.repositories = repositories;
        });
        $scope.$on('$destroy', this.destroy.bind(this));

    }

    RepositoriesController.prototype.openRepository = function(repository) {
        this.$state.go('repository', {
            repository: repository.getName()
        });
    };

    RepositoriesController.prototype.destroy = function() {
        this.$scope = undefined;
        this.repositories = undefined;
    };

    RepositoriesController.$inject = ['$scope', '$state', 'ObjectMapper'];

    return RepositoriesController;
});
