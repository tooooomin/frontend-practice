(function($, window, document, Backbone) {

// Model
var Task = Backbone.Model.extend({
  defaults: {
    title: 'do something!',
    completed: false
  }
});
var task = new Task();

//View
var TaskView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .command': 'sayHallo'
  },
  sayHallo: function() {
    alert('hello');
  },
  template: _.template($('#searchBtn').html()),
  render: function() {
    var template = this.template( this.model.toJSON() );
    this.$el.html(template);
    return this;
  }
});

// Collection
var Tasks = Backbone.Collection.extend({
  model: Task
});
var TasksView = Backbone.View.extend({
  tagName: 'ul',
  render: function() {
    this.collection.each(function(task){
      var taskView = new TaskView({model: task});
      this.$el.append(taskView.render().el);
    }, this);
    return this;
  }
});

var tasks = new Tasks([
    {
      title: 'task1',
      completed: true
    },
    {
      title: 'task2'
    },
    {
      title: 'task3'
    }
]);
var tasksView = new TasksView({collection: tasks});
$('#tasks').html(tasksView.render().el);

})(window.jQuery, window, document, Backbone);
