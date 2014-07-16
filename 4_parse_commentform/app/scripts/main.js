/**
 * comment form
 * parse
 */

var app =  angular.module('comment', []);
app.controller('commentController', ['$scope', '$http', function($scope, $http) {
  $scope.commentList = [];
  $scope.parseCommentList = [];

  $http.get('https://api.parse.com/1/classes/comments', {
    headers: { 
      'X-Parse-Application-Id':'LNsBUdj2n4fufd2L1X020F34Bd0qzLw54Lx9i0Kh',
      'X-Parse-REST-API-Key':'EVD6APhTISTC4jTi6iBCsVgdeebBUkRab0wT6X2Q'
    }
  }).success(function(data, status) {
    console.log(data.results);
    $scope.parseCommentList = data.results;
  });

  $scope.add = function() {
    var date = new Date();
    addTime = date.getTime();
    $scope.commentList.push({'comment': $scope.comment, 'addTime': addTime});

    // $http.post('https://api.parse.com/1/classes/comments', {
    //   headers: { 
    //     'X-Parse-Application-Id':'LNsBUdj2n4fufd2L1X020F34Bd0qzLw54Lx9i0Kh',
    //     'X-Parse-REST-API-Key':'EVD6APhTISTC4jTi6iBCsVgdeebBUkRab0wT6X2Q'
    //   },
    //   params: {
    //     where: {
    //       userName : 'tomoko',
    //       comment  : $scope.comment
    //     }
    //   }
    // }).success(function(data, status) {
    //   console.log('成功');
    // });

    $scope.comment = "";
    console.log($scope.commentList);
  };

  $scope.reset = function() {
    if(window.confirm('内容をリセットしていいですか？')) {
      $scope.comment = "";
    }
  };

  $scope.delete = function($index) {
    if(window.confirm('削除していいですか？')) {
      $scope.commentList.splice($index, 1);
    }
  };
}]);

