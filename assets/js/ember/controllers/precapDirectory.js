App.PrecapDirectoryController = Ember.ArrayController.extend({
    actions: {
        hide: function() {
            this.transitionToRoute('precap');
        }
    }
});
