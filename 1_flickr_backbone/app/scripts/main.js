/*
 * Flickr
 *
 * Copyright (c) 2014 Tomoko Suzuki
 * lightbox2 使用
 */
(function($, window, document) {

  // View
  var SearchView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .js-btn': 'search',
      'submit': 'search'
    },
    initialize: function() {
      // 4. APIの通信が完了すると、modelのsyncイベントが発火する
      this.listenTo(this.model, 'sync', this.render);
      // *. エラーの場合
      this.listenTo(this.model, 'error', this.renderError);
    },
    search: function(e) {
      // ブラウザ標準の機能を停止
      e.preventDefault();
      // 検索ワードをinputタグから取得する
      var query = this.$el.find('.js-search').val();
      // 検索ワードをModelに引き渡す
      this.model.search(query);
    },
    render: function() {
      console.log('成功')
      // modelに格納されたAPIのレスポンスを取り出す
      var photoUrlList = this.model.attributes.list;
      console.log(this.model.attributes);
      // DOMを指定の要素に追加する
      var photoListHtml = _.template($('.js-photo-result').html(), {photoUrlList: photoUrlList});
      this.$el.find('.js-photo-area').html(photoListHtml);
      return this;
    },
    renderError : function() {
      console.log('失敗')
    }
  });

  // Model
  var SearchModel = Backbone.Model.extend({
    initialize: function() {
      // 初期化処理
    },
    url: 'https://api.flickr.com/services/rest/',
    // searchメソッドでAPIを実行
    search: function(query) {
      this.fetch({
        data: {
          method: 'flickr.photos.search',
          per_page: 9,
          tags: 'instagramapp',
          text: query,
          api_key: 'my api key',
          format: 'json',
          nojsoncallback: 1
        }
      });
    },
    // attributesに格納する値の加工
    parse: function(response) {
      var photoUrlList = [];
      var i = 0;
      var photos = response.photos.photo;
      _.each(photos, function(photo){
        photoUrlList[i] = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_m.jpg';
        i++;
      });
      return {
        list: photoUrlList
      }
    }
  });

  var searchView = new SearchView({
    model: new SearchModel()
  });

}(window.jQuery, window, document));
