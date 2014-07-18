require.config({
    paths: {
        'angular': '../bower_components/angular/angular.min',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
        'angularRoute': '../bower_components/angular-route/angular-route.min',
        'angularAnimate': '../bower_components/angular-animate/angular-animate.min',
        'angularJSToaster': '../bower_components/AngularJS-Toaster/toaster',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
        'angularUIKeypress': '../bower_components/angular-ui-utils/keypress.min',
        'lodash': '../bower_components/lodash/dist/lodash.min',
        'restangular': '../bower_components/restangular/dist/restangular.min',
        'talker': '../bower_components/talker/talker-0.1.0.min',
        'angularXEditable': '../bower_components/angular-xeditable/dist/js/xeditable.min',
        'jsonpatch': '../bower_components/jsonpatch/jsonpatch.min',
        'angular-translate': '../bower_components/angular-translate/angular-translate.min',
        'angular-translate-storage-cookie': '../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min'
    },
    shim: {
        'angular' : {'exports' : 'angular', 'deps': ['jquery']},
        'bootstrap': ['jquery'],
        'angular-cookies': ['angular'],
        'angularAnimate': ['angular'],
        'angularRoute': ['angular'],
        'angularJSToaster': ['angular', 'angularAnimate'],
        'angular-ui-router': ['angular'],
        'angularUIKeypress': ['angular'],
        'restangular': ['angular', 'lodash'],
        'talker': ['angular'],
        'angularXEditable': ['angular'],
        'angular-translate': ['angular'],
        'angular-translate-storage-cookie': ['angular', 'angular-translate', 'angular-cookies']
    },
    modules: [
        {
            name: 'vendor',
            include: [
                'angular',
                'jquery',
                'bootstrap',
                'angular-cookies',
                'angularRoute',
                'angularAnimate',
                'angularJSToaster',
                'angular-ui-router',
                'angularUIKeypress',
                'lodash',
                'restangular',
                'talker',
                'angularXEditable',
                'jsonpatch',
                'angular-translate',
                'angular-translate-storage-cookie'
            ],
            override: {
                generateSourceMaps: false,
                optimize: 'none'
            }
        }
    ]
});
