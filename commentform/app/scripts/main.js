/*
 * Flickr AngularJS
 */
var app =  angular.module('comment', []);
app.controller('commentController', ['$scope', function($scope) {
$scope.master = {};
$scope.commentList = [];

$scope.add = function() {
  $scope.commentList.push($scope.comment);
  $scope.comment = "";
  console.log($scope.commentList);
};

$scope.reset = function() {
  if(window.confirm('内容をリセットしていいですか？')) {
    $scope.comment = "";
  }
};

$scope.delete = function($index) {
  $scope.commentList.splice($index, 1);
};

}]);
