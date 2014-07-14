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
          scope.loadMore();
        }
      });
    }
  }
});

app.controller('mainCtrl', ['$scope', 'getPhotoInfo', function($scope, getPhotoInfo) {

  var photoList = [];
  var pageNum = 1;
  $scope.isReady = true;

  $scope.search = function() {
    photoList = [];
    pageNum = 1;
    $scope.loadMore(); 
  };

  $scope.loadMore = function() {
    $scope.loading = true;
    // ロードが終わったら次の読み込みをする
    if($scope.isReady) {
      $scope.isReady = false;
      // flickrから写真を読み込む
      getPhotoInfo({
        pageNum  : pageNum,
        query    : $scope.query,
        callback : function(photoUrlList) {
          $scope.photoList = photoUrlList;
          $scope.isReady = true;
          $scope.loading = false;
        }
      }, photoList);
    };

    pageNum++;
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

app.factory('getPhotoInfo', ['$http', '$resource', function($http, $resource) {
  var options = {};
  function _getApiUrl(options) {
    url = 'https://api.flickr.com/services/rest/?'
      + [
        'method=flickr.photos.search',
        'per_page=6',
        // 検索ページ
        'page=' + options.pageNum,
        // 検索ワードを受け取る
        'text=' + options.query,
        'api_key=63fc702b559001bbbc654780592650dd',
        'format=json',
        'jsoncallback=JSON_CALLBACK'
      ].join('&');
    return url;
  };

  function _getPhotoUrl(photoInfo, photoList) {
    angular.forEach(photoInfo, function(photo) {
      photoUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
      photoList.push({'photoUrl': photoUrl, 'photoId': photo.id, 'noLiked': true});
    });
    return photoList;
  };

  return function(options, photoList) {
    $http.jsonp(_getApiUrl(options)).success(function(data) {
      photoList = _getPhotoUrl(data.photos.photo, photoList);
      options.callback(photoList);
    });
  }

}]);

