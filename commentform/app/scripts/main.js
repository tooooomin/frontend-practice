/*
 * Flickr AngularJS
 */
var app =  angular.module('comment', []);
app.controller('commentController', ['$scope', function($scope) {
  $scope.commentList = [];

  $scope.add = function() {
    var date = new Date();
    addTime = date.getTime();
    // comment = $scope.comment.replace(/\n/g, '<br/>');
    $scope.commentList.push({'comment': $scope.comment, 'addTime': addTime});
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
