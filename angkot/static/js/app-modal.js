(function() {

var mod = angular.module('modal', ['ngSanitize']);
mod.directive('modal', function() {

  return {
    restrict: 'E',
    scope: {
      title: '=?titleText',
      content: '=?contentHtml',
      show: '=?show',
    },
    templateUrl: '/static/partial/modal.html',
    controller: ['$scope', function($scope) {
      $scope.close = function() {
        $scope.show = false;
      }
    }]
  }

});

})();

