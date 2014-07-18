define([], function() {
    'use strict';

    // from http://stackoverflow.com/a/18609594
    function RecursionHelper($compile) {
        return {
            compile: function(element) {
                var contents = element.contents().remove();
                var compiledContents;
                return function(scope, element) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });
                };
            }
        };
    }

    RecursionHelper.$inject = ['$compile'];

    return RecursionHelper;
});
