/*
 * Flickr AngularJS
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * lightbox2 使用
 */
var app =  angular.module('flickr', []);

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

app.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.search = function() {
    var url = 'https://api.flickr.com/services/rest/?'
      + [
        'method=flickr.photos.search',
        'per_page=9',
        'tags=instagramapp',
        // 検索ワードを受け取る
        'text=' + encodeURIComponent($scope.query),
        'api_key=63fc702b559001bbbc654780592650dd',
        'format=json',
        'jsoncallback=JSON_CALLBACK'
      ].join('&');

    _getPhotoUrlList(url);
  }

  // toggleModal()でmodal-dialogの呼び出し
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    var largePhoto = this.photoUrl.replace('_m.jpg', '_z.jpg');
    $scope.photoUrl = largePhoto;
    $scope.modalShown = true;
  };

  function _getPhotoUrlList(url) {
      // APIを実行
    $http.jsonp(url).success(function(data) {
      // 画像リンクを配列に入れる
      var photos = data.photos.photo;
      var photoUrlList = [];
      angular.forEach(photos, function(photo) {
        // pushで配列に追加
        this.push('http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg');
      }, photoUrlList);
      // htmlに送る
      $scope.photoUrlList = photoUrlList;
    });
  }
}]);


