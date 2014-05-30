/* global define */
/* jshint indent:2 */

define([
  'angular',
  'app',
  'locales/en_EN',
  'locales/fr_FR',
  'config',
  'controllers/front',
  'services/event-bridge',
  'services/api-foundation',
  'services/menu',
  'services/menu-builder-factory'
], function(angular, app, localeEN, localeFR) {
  'use strict';

  var firstLoad = true;

  app.value('$anchorScroll', angular.noop)
  .config(function($stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider, mbApiFoundationProvider, mbConfig){
    mbApiFoundationProvider.setServer(mbConfig.api.server);
    mbApiFoundationProvider.setRepositoriesPrefix(mbConfig.api.prefixes.repositories);
    mbApiFoundationProvider.setWorkspacesPrefix(mbConfig.api.prefixes.workspaces);
    mbApiFoundationProvider.setNodesPrefix(mbConfig.api.prefixes.nodes);

    RestangularProvider.setDefaultHttpFields({cache: true});
    $urlRouterProvider
      .when('', '/')
      .otherwise('/');

    $stateProvider
      .state('repositories', {
        url:'/',
        resolve: {
          repositories: ['$rootScope', '$q', 'mbObjectMapper', function($rootScope, $q, ObjectMapper) {
            $rootScope.$emit('browser.load');
            return ObjectMapper.find().then(function(repositories) {
              $rootScope.$emit('browser.loaded');
              return repositories;
            }, function(err) {
              return $q.reject(err);
            });
          }]
        },
        templateUrl: '/assets/js/browser/views/repositories.html',
        controller: 'mbRepositoriesCtrl'
      })
      .state('repository', {
        url: '/:repository',
        resolve: {
          repository: ['$rootScope', '$q', '$stateParams', 'mbObjectMapper', function($rootScope, $q, $stateParams, ObjectMapper) {
            $rootScope.$emit('browser.load');
            return ObjectMapper.find('/' + $stateParams.repository).then(function(repository) {
              $rootScope.$emit('browser.loaded');
              return repository;
            }, function(err) {
              return $q.reject(err);
            });
          }]
        },
        templateUrl: '/assets/js/browser/views/repository.html',
        controller : 'mbRepositoryCtrl'
      })
      .state('workspace', {
        url: '/:repository/:workspace{path:(?:/.*)?}',
        resolve: {
          node: ['$rootScope', '$q', '$stateParams', 'mbObjectMapper', 'mbTreeCache', function($rootScope, $q, $stateParams, ObjectMapper, TreeCache) {
            var path = ($stateParams.path) ? $stateParams.path : '/',
                params = {};

            if (firstLoad) {
              params = { reducedTree: true, cache: false };
            }

            $rootScope.$emit('browser.load');
            return ObjectMapper.find('/' + $stateParams.repository + '/' + $stateParams.workspace + path, params).then(function(node) {
              if (firstLoad) {
                firstLoad = false;
                TreeCache.buildRichTree(node).then(function() {
                  $rootScope.$emit('browser.loaded');
                });
              } else {
                $rootScope.$emit('browser.loaded');
              }
              return node;
            });
          }]
        },
        templateUrl: '/assets/js/browser/views/workspace.html',
        controller: 'mbWorkspaceCtrl'
      });

    $translateProvider
      .useCookieStorage()
      .translations('en', localeEN)
      .translations('fr', localeFR)
      .fallbackLanguage('en')
      .registerAvailableLanguageKeys(['en', 'fr'], {
        'en_US': 'en',
        'en_UK': 'en',
        'fr_FR': 'fr',
        'de_DE': 'en',
        'it_IT': 'en'
      })
      .determinePreferredLanguage();

  })
  .config(function($provide) {
    $provide.decorator('$window', ['$delegate', function($delegate) {
      $delegate.requestAnimFrame = (function(){
        return (
            $delegate.requestAnimationFrame       ||
            $delegate.webkitRequestAnimationFrame ||
            $delegate.mozRequestAnimationFrame    ||
            $delegate.oRequestAnimationFrame      ||
            $delegate.msRequestAnimationFrame     ||
            function(/* function */ callback){
              $delegate.setTimeout(callback, 1000 / 60);
            }
        );
      })();
      return $delegate;
    }]);
  })
  .run(['$rootScope', '$log', '$translate', 'toaster', 'editableOptions', 'mbEventBridge', 'mbMenu', 'mbMenuBuilderFactory', function($rootScope, $log, $translate, toaster, editableOptions, EventBridge, Menu, MenuBuilderFactory) {
    editableOptions.theme = 'bs3';

    $log.before('error', function(message, toast, display) {
      display = display === undefined ? true : display;
      if (display) {
        if (toast) { message = toast; }
        $translate('ERROR').then(function(translation) {
          toaster.pop('error', translation, message);
        }, function(err) {
          toaster.pop('error', err, message);
        });
      }
    });
    $log.before('log', function(message, toast, display) {
      display = display === undefined ? true : display;
      if (display) {
        if (toast) { message = toast; }
        $translate('SUCCESS').then(function(translation) {
          toaster.pop('success', translation, message);
        }, function(err) {
          toaster.pop('success', err, message);
        });
      }
    });
    $log.before('info', function(message, toast, display) {
      display = display === undefined ? true : display;
      if (display) {
        if (toast) { message = toast; }
        $translate('NOTE').then(function(translation) {
          toaster.pop('note', translation, message);
        }, function(err) {
          toaster.pop('note', err, message);
        });
      }
    });
    $log.before('warn', function(message, toast, display) {
      display = display === undefined ? true : display;
      if (display) {
        if (toast) { message = toast; }
        $translate('WARNING').then(function(translation) {
          toaster.pop('warning', translation, message);
        }, function(err) {
          toaster.pop('warning', err, message);
        });
      }
    });

    $log.decorate(function(message) {
      return [message]; // To remove toast in the log
    });

    $rootScope.$on('$stateChangeError', function(evt, toState, toParams, fromState, fromParams, err) {
      if (err.data && err.data.message) {
        return $log.error(err, err.data.message);
      }
      $translate('ERROR_RETRY', function(translation) {
        $log.error(err, translation);
      }, function() {
        $log.error(err);
      });
    });

    $rootScope.$on('workspace.open.start', function() {
      // When changing workspace, we need to rebuild the RichTree cached by TreeCache
      firstLoad = true;
    });

    Menu.appendBuilder(MenuBuilderFactory.getRepositoriesBuilder());
    Menu.appendBuilder(MenuBuilderFactory.getRepositoryBuilder());
    Menu.appendBuilder(MenuBuilderFactory.getWorkspaceBuilder());
  }]);
});
