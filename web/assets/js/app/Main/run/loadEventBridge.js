define([], function () {
    "use strict";

    function loadEventBridge(EventBridge) {
        // We just add dependecy to force angular to instanciate the service
    }

    loadEventBridge.$inject = ['EventBridge'];

    return loadEventBridge;
});

