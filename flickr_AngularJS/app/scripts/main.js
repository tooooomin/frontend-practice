/*
 * Flickr AngularJS
 */
var app =  angular.module('flickr', ['ngResource']);

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      };
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      };
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template:
    '<div class="modal" ng-show="show">' +
      '<div class="modal-overlay" ng-click="hideModal()"></div>' +
      '<div class="modal-dialog" ng-style="dialogStyle">' +
        '<div class="modal-close" ng-click="hideModal()">✕</div>' +
        // ng-transclude DOMの挿入点の親要素を指定
        '<div class="modal-dialog-content" ng-transclude></div>' +
      '</div>' +
    '</div>'
  }
});

app.directive('scroller', function($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      rawElement = element[0];
      // scroll event
      angular.element($window).bind('scroll', function() {
        if((window.innerHeight - rawElement.getBoundingClientRect().top) >= rawElement.getBoundingClientRect().height) {
          console.log(scope.flag);
          if (scope.flag) {
            scope.$apply('loadMore()');
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
      $scope.flag = false;
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
      $scope.flag = true;
    };
    $scope.loadMore();
  };


  // toggleModal()でmodal-dialogの呼び出し
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    var largePhoto = this.photoUrl.replace('_m.jpg', '_z.jpg');
    $scope.photoUrl = largePhoto;
    $scope.modalShown = true;
  };

  function _getPhotoUrlList(url, photoUrlList) {

    // photoList.jsonを取得
    $scope.getPhotoList = function() {
      $resource('/scripts/photoList.json').get(
        function(data) {
          var photos = data.photos;
          angular.forEach(photos, function(photo) {
            // pushで配列に追加
            this.push('http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg');
          }, photoUrlList);
          // console.log(photoUrlList);
          // htmlに送る
          $scope.photoUrlList = photoUrlList;
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
    //   console.log(photoUrlList);
    //   // htmlに送る
    //   $scope.photoUrlList = photoUrlList;

    // });
  }
}]);


