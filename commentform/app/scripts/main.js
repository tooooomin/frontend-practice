/*
 * Flickr AngularJS
 */
var app =  angular.module('comment', []);
app.controller('commentController', ['$scope', function($scope) {
$scope.master = {};
commentList = [];

$scope.update = function(user) {
  $scope.master= angular.copy(user);
  $scope.comments = commentList.concat($scope.master);
  console.log($scope.comments);
};

$scope.reset = function() {
  $scope.user = angular.copy($scope.master);
}
$scope.reset();

}]);
