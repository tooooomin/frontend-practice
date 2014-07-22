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
  var skipPage = 0;
  var limit = 4;

  $scope.more = function() {
    var subConfig = {
      params : {
        'order'   : '-createdAt',
        'skip'    : skipPage,
        'limit'   : limit,
        'include' : 'post'
      }
    };
    $http.get(url, angular.extend(config, subConfig)).success(function(data, status) {
      $scope.parseCommentList = $scope.parseCommentList.concat(data.results);
      if (data.results.length < limit) {
        $scope.isRoadMore = true;
      }
    });
    skipPage += limit;
  }
  $scope.more();

  $scope.add = function() {
    if(!$scope.isUpdate) {
      $scope.isUpdate = true;
      $http.post(url, {
        userName : 'tomoko',
        comment  : $scope.comment
      }, config).success(function(data, status) {
        $scope.isUpdate = false;
        window.location.reload();
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
          window.location.reload();
        });
      }
    }
  };

}]);

