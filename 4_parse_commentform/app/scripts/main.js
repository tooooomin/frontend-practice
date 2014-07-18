/**
 * comment form
 * parse.com
 */

var app =  angular.module('comment', []);
app.controller('commentController', ['$scope', '$http', function($scope, $http) {
  $scope.commentList = [];
  $scope.parseCommentList = [];
  var url = 'https://api.parse.com/1/classes/comments/';
  var config = {
    headers : { 
      'X-Parse-Application-Id' : 'LNsBUdj2n4fufd2L1X020F34Bd0qzLw54Lx9i0Kh',
      'X-Parse-REST-API-Key'   : 'EVD6APhTISTC4jTi6iBCsVgdeebBUkRab0wT6X2Q'
    }
  };

  // $scope.show = function() {
  //   $http.get(url, config).success(function(data, status) {
  //     $scope.parseCommentList = data.results;
  //   });
  // }
  // $scope.show();

  var page = 0;
  var limit = 1;
  $scope.more = function() {
      console.log(page);
    $http.get(url, {
    headers : { 
      'X-Parse-Application-Id' : 'LNsBUdj2n4fufd2L1X020F34Bd0qzLw54Lx9i0Kh',
      'X-Parse-REST-API-Key'   : 'EVD6APhTISTC4jTi6iBCsVgdeebBUkRab0wT6X2Q'
    },
    params : {
      'order'   : '-createdAt',
      'skip'  : page,
      'limit'   : limit,
      'include' : 'post'
    }
    }).success(function(data, status) {
      $scope.parseCommentList = $scope.parseCommentList.concat(data.results);
      console.log($scope.parseCommentList);
    });
  page += limit;
  }
  $scope.more();

  $scope.add = function() {
    if(!$scope.isUpdate) {
      $scope.isUpdate = true;
      $http.post(url, {
        userName : 'tomoko',
        comment  : $scope.comment
      }, config).success(function(data, status) {
        $scope.show();
        $scope.isUpdate = false;
      }).error(function(data, status) {
        $scope.add();
      });
      $scope.comment = "";
    } else {
      console.log('投稿中');
    }
  };

  $scope.reset = function() {
    if(window.confirm('内容をリセットしていいですか？')) {
      $scope.comment = "";
    }
  };

  $scope.delete = function(comment) {
    if(window.confirm('削除していいですか？')) {
      if(!$scope.isDelete) {
        $scope.isDelete = true;
        $http.delete(url + comment.objectId, config).success(function(data, status) {
          $scope.isDelete = false;
          console.log('削除しました');
          $scope.show();
        });
      }
    }
  };

}]);

