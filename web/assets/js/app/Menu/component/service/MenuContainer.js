define([], function() {
    'use strict';
    /**
     * MenuContainer provide logic to build the navbar. It uses builders (see MenuBuilderFactory) to generate each link.
     */
    function MenuContainer($rootScope) {
        this.menu = {};
        this.builders = {};
        this.currentStateName = null;

        $rootScope.$on('$stateChangeSuccess', this.onStateChangeSuccess.bind(this));
        $rootScope.$on('$translateChangeSuccess', this.onTranslateChangeSuccess.bind(this));
    }

    /**
     * Reset the menu container
     */
    MenuContainer.prototype.resetMenu = function() {
        this.menu = {};
    };

    /**
     * Get the menu container
     * @return {object}
     */
    MenuContainer.prototype.getMenu = function() {
        return this.menu;
    };

    /**
     * Run a menu link builder
     * @param  {name} name
     * @param  {mixed} builder
     */
    MenuContainer.prototype.runBuilder = function(name, builder) {
        var self = this;
        if (typeof(builder) === 'function') {
            return builder(function(link) {
                self.menu[name] = link;
            });
        }

        for (var i=0; i<builder.length; i++) {
            if (i < builder.length-1) {
                this.runBuilder(builder[i], this.builders[builder[i]]);
            } else {
                this.runBuilder(name, builder[i]);
            }
        }
    };

    /**
     * Register a menu link builder
     * @param  {object} builderContainer
     */
    MenuContainer.prototype.appendBuilder = function(builderContainer) {
        this.builders[builderContainer.name] = builderContainer.builder;
    };

    /**
     * Compile the menu for a route
     * @param  {string} routeName
     */
    MenuContainer.prototype.compileMenu = function(routeName) {
        this.resetMenu();
        if (this.builders[routeName]) {
            this.runBuilder(routeName, this.builders[routeName]);
        }
    };

    MenuContainer.prototype.onStateChangeSuccess = function(evt, toState, toParams, fromState, fromParams) {
        if (toState.name === fromState.name &&
        toParams.repository === fromParams.repository &&
        toParams.workspace === fromParams.workspace ) {
            return;
        }
        this.currentStateName = toState.name;
        this.compileMenu(toState.name);
    };

    MenuContainer.prototype.onTranslateChangeSuccess = function() {
        this.compileMenu(this.currentStateName);
    };

    MenuContainer.$inject = ['$rootScope'];

    return MenuContainer;
});
