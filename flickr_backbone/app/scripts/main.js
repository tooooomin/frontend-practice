/*
 * Flickr
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * lightbox2 使用
 */
(function($, window, document) {

  $(function() {

    var search_tag = "";
    var photoList = "";

    // 画面サイズの判定を呼び出し、縦横で表示を変える（予定）
    getWindowSize(photoList);

    // 検索ボタンをクリックした時の挙動
    $('#btn').on('click', function(){
      // フォームに入力された値を所得する
      search_tag = htmlEncode($('#search').val());

      var options = {};
      options.url = 'https://api.flickr.com/services/rest/';
      options.method = 'GET';

      options.params = {
          method: 'flickr.photos.search',
          per_page: 20,
          tags: 'instagramapp',
          text: search_tag ,
          api_key: '63fc702b559001bbbc654780592650dd',
          format: 'json',
          nojsoncallback: 1
      };

      requestSearch(options);

    });

  });

  // encodeしたい値をtextで受け取り、innerHTMLでreturn
  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

  // 画面サイズ判定
  function getWindowSize(photoList) {

    var isLandscape = false; // 縦横判定のフラグ
    var $win = $(window);
    $win.on('resize', function(){
      if($win.width() > $win.height()) {
        // 1.横画面
        isLandscape = false;
        console.log(isLandscape);
      } else {
        // 2.縦画面
        isLandscape = true;
        console.log(isLandscape);
        // portraitRendring(photoList);
      }
    })
    .trigger('resize');
  }

  // 縦表示のレンダリング
  function portraitRendring(photoList) {

      var file = "";
      var tag = "";

      photoList.forEach(function(index) {
        console.log(index);
        file = "http://farm" + index.farm + ".static.flickr.com/" + index.server + "/" + index.id + "_" + index.secret + "_" + "c" +".jpg";
        // 表示される画像に多きファイルのリンクとlightboxを表示するためのオプションを追加
        tag += "<a id='large_pic' href='" + file + "' data-lightbox='roadtrip'><img src='" + file + "' width='100' height='100'></a>";
      });
      $('#result').empty().append(tag);
  }

  var isInit = false;

  // flickrから画像を所得する
  function requestSearch(options) {
    $.ajax({
      type: options.method,
      url: options.url,
      data: options.params
    })
    .done(function(data) {

      // 縦表示のレンダリングをする（横画面未実装）
      portraitRendring(data.photos.photo);

    })
    .fail(function() {
      console.log("失敗");
    });
  }

}(window.jQuery, window, document));
