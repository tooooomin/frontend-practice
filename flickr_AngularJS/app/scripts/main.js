/*
 * Flickr AngularJS
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * lightbox2 使用
 */
var mainCtrl = function($scope, $http) {
  $scope.doSearch = function() {
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
      // APIを実行
      $http.jsonp(url).success(function(data) {
        // 画像リンクを配列に入れる
        var photos = data.photos.photo;
        var photoUrlList = [];
        angular.forEach(photos, function(photo) {
          this.push('http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg');
        }, photoUrlList);
        // htmlに送る
        $scope.photoUrlList = photoUrlList;
      });
  }
}
