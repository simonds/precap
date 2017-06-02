App.PrecapFindController = Ember.ArrayController.extend({
    needs: 'precap'
    ,actions: {
        hide: function() {
            this.transitionToRoute('precap');
        }
        ,select: function(precap) {
            this.transitionToRoute('precap', precap);
        }
    }
});
