define([], function () {
    "use strict";

    function loadMenus(MenuContainer, MenuBuilderFactory) {
        MenuContainer.appendBuilder(MenuBuilderFactory.getRepositoriesBuilder());
        MenuContainer.appendBuilder(MenuBuilderFactory.getRepositoryBuilder());
        MenuContainer.appendBuilder(MenuBuilderFactory.getNodeBuilder());
    }

    loadMenus.$inject = ['MenuContainer', 'MenuBuilderFactory'];

    return loadMenus;
});

