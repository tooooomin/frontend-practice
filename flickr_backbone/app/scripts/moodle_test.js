/*
 * Flickr
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * オリジナルモーダルを実装
 */
(function($, window, document) {

  $(function() {

    var search_tag = "";
    var wn = "";

    $('#btn').on('click', function(){

      search_tag = htmlEncode($('#search').val());
      // $('p#input').empty().append(search_tag);

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

    // 画像にイベントハンドラを追加
    $(document).on('click', 'img.btns', function(){
      wn = '.' + $(this).data('tgt');
      var mW = $(wn).find('.modal_body').innerWidth() / 2;
      var mH = $(wn).find('.modal_body').innerHeight() / 2;
      $(wn).find('.modal_body').css({'margin-left':-mW,'margin-top':-mH});
      $(wn).fadeIn(500);
    });
    // closeボタンをクリックしたら要素をfadeoutする
    $(document).on('click', 'button.close', function(){
      $(wn).fadeOut(500);
    });

  });

  // encodeしたい値をtextで受け取り、innerHTMLでreturn
  function htmlEncode(value){
    return $('<div/>').text(value).html();
  }

  // flickrかが画像を所得する
  function requestSearch(options) {
    $.ajax({
      type: options.method,
      url: options.url,
      data: options.params
    })
    .done(function(data) {
      console.log(data.photos.photo);
      var file = "";
      var tag = "";
      var i = 0;

      $(data.photos.photo).each(function(index) {
        // クラス名指定のためiの値を所得画像分増やす
        i++;

        file = "http://farm" + this.farm + ".static.flickr.com/" + this.server + "/" + this.id + "_" + this.secret + "_" + "c" +".jpg";
        tag += "<div class='modal wd" + i + "'><div class='modal_body'><button class='close'>close</button><br /><img src='" + file + "' width='300px'><div class='modalBK'></div></div></div><img data-tgt='wd" + i + "' class='btns' src='" + file + "' width='100' height='100'>";

      });

      $('#result')
        .empty()
        .append(tag);

    })
    .fail(function() {
      console.log("失敗");
    });
  }

}(window.jQuery, window, document));
