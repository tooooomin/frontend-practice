/*
 * Flickr
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * lightbox2 使用
 */
(function($, window, document) {

  // Model
  var FlickrModel = Backbone.Model.extend({
    initialize: function() {
      // 初期化処理
      this.set({
        domId: 'photo_' + this.cid
      });
    }
  });
  new FlickrModel();

  var FlickrCollection = Backbone.Collection.extend({
    model: FlickrModel
  });

  // View
  var showPicture = Backbone.View.extend({
    el: 'body',
    events: {
      'click .btn': 'searchPhoto'
    },
    searchPhoto: function() {
      var search_tag = $('.search').val();
      var options = {};
      options.url = 'https://api.flickr.com/services/rest/';
      options.method = 'GET';

      options.params = {
          method: 'flickr.photos.search',
          per_page: 10,
          tags: 'instagramapp',
          text: search_tag ,
          api_key: '63fc702b559001bbbc654780592650dd',
          format: 'json',
          nojsoncallback: 1
      };
      $.ajax({
        type: options.method,
        url: options.url,
        data: options.params
      })
      .done(function(data) {
        var file = "";
        var tag = "";

        template: _.template($('#task-template').html()),

        console.log(data.photos.photo);
        data.photos.photo.forEach(function(index) {
          file = "http://farm" + index.farm + ".static.flickr.com/" + index.server + "/" + index.id + "_" + index.secret + "_" + "c" +".jpg";
          // 大きいファイルのリンクとlightboxを表示するためのオプションを追加
          tag += "<a id='large_pic' href='" + file + "' data-lightbox='roadtrip'><img src='" + file + "' width='100' height='100'></a>";
        });
        $('#result').empty().append(tag);
      })
      .fail(function() {
        console.log("失敗");
      });

    }
  });
  new showPicture();

}(window.jQuery, window, document));
