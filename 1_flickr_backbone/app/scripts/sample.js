var SearchView = Backbone.View.extend({

  el: 'body',

  events : {
    'click .btn' : 'search'
  },

  initialize : function() {
    // 4. APIの通信が完了すると、modelのsyncイベントが発火する
    // 真ん中はイベント名で既存の名前があります
    this.listenTo(this.model, 'sync', this.render);

    // *. エラーの場合
    this.listenTo(this.model, 'error', this.renderError);
  },

  search : function() {
    // 1. 検索ワードをinputタグから取得する

    // 2. 検索ワードをModelに引き渡す

    // modelのsearchメソッドに検索文字列を渡して実行
    this.model.search(query);
  },

  render : function() {
    // 5. modelに格納された、APIのレスポンスを取り出す
    // 6. そのレスポンスをもとにDOMを生成
    // 7. DOMを指定の要素に追加する
  },

  template : function() {
    // DOMかえす
  },

  renderError : function() {
    alert('エラーだよ');
  }
});

var SearchModel = Backbone.Model.extend({
  url : function() {
    return url;
  },
  search : function(query) {
    // 3. ModelでAPIを実行する＝Model.fetch()を実行する
    this.fetch({
      data : {
        ...
      }
    });
  },
  ...
});


var searchView = new SearchView({
  model : new SearchModel()
});
