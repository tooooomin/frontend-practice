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

app.controller('mainCtrl', ['$scope', '$http', '$resource', 'flickrApi', 'getPhotoInfo', 
  function($scope, $http, $resource, flickrApi, getPhotoInfo) {

  $scope.search = function() {
    var photoList = [];
    var pageNum = 1;
    $scope.loadMore = function() {
      // $scope.isReady = false;

      // flickrから写真を読み込む
      // url = flickrApi.url(pageNum, $scope.query);
      // getPhotoInfo.flickerPhotoList(url, photoList);
      // jsonから写真を読み込む
      getPhotoInfo.jsonPhotoInfo(photoList);

      pageNum++;
    };
    $scope.loadMore();
  };

  // modal
  $scope.showModal = function() {
    var largePhotoUrl = this.photo.photoUrl.replace('_m.jpg', '_z.jpg');
    $scope.largePhotoUrl = largePhotoUrl;
    $scope.show = true;
  };
  $scope.hideModal = function() {
    $scope.show = false;
  };

  // likebutton
  $scope.likeButton = function() {
    this.photo.noLiked = !this.photo.noLiked;
  };

}]);

app.factory('flickrApi', function() {
  return {
    url: function(pageNum, query) {
      url = 'https://api.flickr.com/services/rest/?'
        + [
          'method=flickr.photos.search',
          'per_page=' + 6,
          // 検索ページ
          'page=' + pageNum,
          // 検索ワードを受け取る
          'text=' + encodeURIComponent(query),
          'api_key=63fc702b559001bbbc654780592650dd',
          'format=json',
          'jsoncallback=JSON_CALLBACK'
        ].join('&');
      return url;
    }
  };
});

app.factory('getPhotoInfo', function($resource, $http) {
  return {
    jsonPhotoInfo: function(photoList) {
      $scope.isReady = false;
      $resource('/scripts/photoList.json').get(
        function(data) {
          angular.forEach(data.photos, function(photo) {
            photoUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
            photoList.push({'photoUrl': photoUrl, 'photoId': photo.id, 'noLiked': true});
          });
          $scope.photoList = photoList;
          $scope.isReady = true;
        }
      );
    },
    flickerPhotoList: function(url, photoList) {
      $scope.isReady = false;
      $http.jsonp(url).success(function(data) {
        var photos = data.photos.photo;
        angular.forEach(photos, function(photo) {
          // pushで配列に追加
          photoUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
          photoList.push({'photoUrl': photoUrl, 'photoId': photo.id, 'noLiked': true});
        });
        // htmlに送る
        $scope.photoList = photoList;
        $scope.isReady = true;
      });
    }
  }
});

