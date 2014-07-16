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
        page  : pageNum,
        text  : $scope.query,
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
  var url = 'https://api.flickr.com/services/rest';
  function _getApiConfig(options) {
    var params = {
      method       : 'flickr.photos.search',
      per_page     : 6,
      page         : 'search page',
      text         : 'search text',
      api_key      : '63fc702b559001bbbc654780592650dd',
      format       : 'json',
      jsoncallback : 'JSON_CALLBACK'
    }
    return angular.extend(params, options);
  };

  function _getPhotoUrl(photoInfo, photoList) {
    angular.forEach(photoInfo, function(photo) {
      photoUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
      photoList.push({'photoUrl': photoUrl, 'photoId': photo.id, 'noLiked': true});
    });
    return photoList;
  };

  return function(options, photoList) {
    $http.jsonp(url, {params : _getApiConfig(options)}).success(function(data) {
      photoList = _getPhotoUrl(data.photos.photo, photoList);
      options.callback(photoList);
    });
  }

}]);

