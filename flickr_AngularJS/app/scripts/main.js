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

app.controller('mainCtrl', ['$scope', 'getPhotoInfo', function($scope, getPhotoInfo) {

  var photoList = [];
  var pageNum = 1;

  $scope.search = function() {
    photoList = [];
    pageNum = 1;
    $scope.loadMore();
  };

  $scope.loadMore = function() {
    $scope.isReady = false;
    $scope.loading = true;

    // flickrから写真を読み込む
    getPhotoInfo.flickerPhotoInfo().get({
      pageNum: pageNum,
      query: $scope.query
      },
      function(data){
        _getPhotoUrl(data.photos.photo)
    });

    // jsonから写真を読み込む
    // getPhotoInfo.jsonPhotoInfo().get(function(data){
    //   _getPhotoUrl(data.photos);
    // });

    pageNum++;
  };

  function _getPhotoUrl(photoInfo) {
    // setTimeout(function(){
      angular.forEach(photoInfo, function(photo) {
        // pushで配列に追加
        photoUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
        photoList.push({'photoUrl': photoUrl, 'photoId': photo.id, 'noLiked': true});
      });
      $scope.photoList = photoList;
      $scope.isReady = true;
      $scope.loading = false;
    // }, 2000);
  }

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

app.factory('getPhotoInfo', ['$resource', function($resource) {
  url = 'https://api.flickr.com/services/rest/?'
    + [
      'method=flickr.photos.search',
      'per_page=6',
      // 検索ページ
      'page=:pageNum',
      // 検索ワードを受け取る
      'text=:query',
      'api_key=63fc702b559001bbbc654780592650dd',
      'format=json',
      'jsoncallback=JSON_CALLBACK'
    ].join('&');

  return {
    jsonPhotoInfo: function() {
      return $resource('/scripts/photoList.json', {}, {
        get: {method:'GET', isArray: false}
      });
    },
    flickerPhotoInfo: function() {
      return $resource(url, {}, {
        get: {method:'JSONP', isArray: false}
      });
    }
  }
}]);

