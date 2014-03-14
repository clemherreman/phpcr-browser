(function($, angular, app) {
  'use strict';

  app.controller('mbPropertiesCtrl', ['$scope', '$log', '$filter', 'mbRouteParametersConverter',
    function($scope, $log, $filter, RouteParametersConverter) {
      $scope.$on('search.change', function(e, value) {
        $scope.search = value;
      });

      $scope.$on('drop.delete', function(e, element) {
        if (element.hasClass('property-item')) {
          $scope.currentNode.deleteProperty(element.data('name')).then(function() {
            $log.log('Property deleted');
            $scope.properties = normalize($scope.currentNode.getProperties());
          }, function(err) {
            if (err.status === 423) { return $log.error('You can not delete this property.'); }
            $log.error(err);
          });
        }
      });

      var normalize = function(data) {
        var array = [];
        for (var i in data) {
          if (!data) { continue; }
          if (typeof(data[i]) === 'object') { data[i] = normalize(data[i]); }
          array.push({ name: i, value: data[i] });
        }
        return  array;
      };


      RouteParametersConverter.getCurrentNode().then(function(node) {
        $scope.properties = normalize(node.getProperties());
      }, function(err) {
        $log.error(err);
      });

      $scope.typeof = function(o) { return typeof(o); };
    }]);
})($, angular, angular.module('browserApp'));
