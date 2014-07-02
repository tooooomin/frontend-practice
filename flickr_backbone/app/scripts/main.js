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
      'click .btn': 'search'
    },
    initialize: function() {
      // 4. APIの通信が完了すると、modelのsyncイベントが発火する
      this.listenTo(this.model, 'sync', this.render);
      // *. エラーの場合
      this.listenTo(this.model, 'error', this.renderError);
    },
    search: function() {
      // 検索ワードをinputタグから取得する
      var query = $('.search').val();
      // 検索ワードをModelに引き渡す
      this.model.search(query);
    },
    // template: _.template($('#photo_result').html()),
    render: function() {
      console.log('成功')
      // modelに格納されたAPIのレスポンスを取り出す
      var photos = this.model.attributes.photos.photo;
      // DOMを指定の要素に追加する
      var template = _.template($('#photoResult').html(), {photos: photos});
      this.$el.find('.photo_area').html(template);
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
    url: function() {
      return 'https://api.flickr.com/services/rest/';
    },
    // searchメソッドでAPIを実行
    search: function(query) {
      this.fetch({
        data: {
          method: 'flickr.photos.search',
          per_page: 10,
          tags: 'instagramapp',
          text: query,
          api_key: '63fc702b559001bbbc654780592650dd',
          format: 'json',
          nojsoncallback: 1
        }
      });
    }
  });
  var searchModel = new SearchModel();

  var searchView = new SearchView({
    model : new SearchModel()
  });

}(window.jQuery, window, document));
