define([], function () {
    "use strict";

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    function NavbarController($scope, $translate, $state, MenuContainer) {
        this.$scope = $scope;
        this.$translate = $translate;
        this.$state = $state;
        this.MenuContainer = MenuContainer;

        $scope.treeIsDisplayed = false;
        $scope.isWorkspaceState = false;

        $scope.broadcast = function(event, data) {
            $scope.$emit(event, data);
        };

        var self = this;
        $scope.$watch(function() {
            return self.MenuContainer.getMenu();
        }, function(menu) {
            self.menu = menu;
        });

        $scope.$watch('search', function(value) {
            $scope.$emit('_search.change', value);
        });

        $scope.$watch(function() {
            return $state.current.name;
        }, function(name) {
            self.isWorkspaceState = name === 'node';
        });

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    NavbarController.prototype.isPreferredLanguage = function(key) {
        return this.$translate.use() === key;
    };

    NavbarController.prototype.changeLanguage = function(key) {
        return this.$translate.use(key);
    };

    NavbarController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$translate = undefined;
        this.$state = undefined;
    };

    NavbarController.$inject = ['$scope', '$translate', '$state', 'MenuContainer'];

    return NavbarController;
});
