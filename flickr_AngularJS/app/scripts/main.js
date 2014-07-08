/*
 * Flickr AngularJS
 */
var app =  angular.module('flickr', ['ngResource']);

app.directive('scroller', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      rawElement = element[0];
      // scroll event
      angular.element($window).on('scroll', function() {
        var rect = rawElement.getBoundingClientRect();
        if((window.innerHeight - rect.top) >= rect.height) {
          if (scope.isReady) {
            scope.loadMore();
          }
        }
      });
    }
  }
});

app.controller('mainCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {
  $scope.search = function() {
    var photoUrlList = [];
    var pageNum = 1;
    $scope.loadMore = function() {
      $scope.isReady = false;
      console.log('load more picture');
      var url = 'https://api.flickr.com/services/rest/?'
        + [
          'method=flickr.photos.search',
          'per_page=' + 6,
          // 検索ページ
          'page=' + pageNum,
          // 検索ワードを受け取る
          'text=' + encodeURIComponent($scope.query),
          'api_key=63fc702b559001bbbc654780592650dd',
          'format=json',
          'jsoncallback=JSON_CALLBACK'
        ].join('&');

      _getPhotoUrlList(url, photoUrlList);
      pageNum++;
    };
    $scope.loadMore();
  };

  // modalの呼び出し
  $scope.showModal = function() {
    var getPhotoUrl = this.photoUrl.replace('_m.jpg', '_z.jpg');
    $scope.largePhotoUrl = getPhotoUrl;
    $scope.show = true;
  };
  $scope.hideModal = function() {
    $scope.show = false;
  };

  // APIを実行して画像を所得するメソッド
  function _getPhotoUrlList(url, photoUrlList) {
    // photoList.jsonを取得
    $scope.getPhotoList = function() {
      $resource('/scripts/photoList.json').get(
        function(data) {
          angular.forEach(data.photos, function(photo) {
            // pushで配列に追加
            this.push('http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg');
          }, photoUrlList);
          // htmlに送る
          $scope.photoUrlList = photoUrlList;
          $scope.isReady = true;
        }
      );
    };
    $scope.getPhotoList();

    // APIを実行
    // $http.jsonp(url).success(function(data) {
    //   // 画像リンクを配列に入れる
    //   var photos = data.photos.photo;
    //   // var photoUrlList = [];
    //   angular.forEach(photos, function(photo) {
    //     // pushで配列に追加
    //     this.push('http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg');
    //   }, photoUrlList);
    //   // htmlに送る
    //   $scope.photoUrlList = photoUrlList;
    //   $scope.isReady = true;
    // });
  }
}]);


