define([], function () {
    "use strict";

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    function NavbarItemController($scope, $state) {
        this.$scope = $scope;
        this.$state = $state;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    NavbarItemController.prototype.openLink = function(link) {
        this.$state.go(link.state, link.params);
    };

    NavbarItemController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$state = undefined;
    };

    NavbarItemController.$inject = ['$scope', '$state'];

    return NavbarItemController;
});
