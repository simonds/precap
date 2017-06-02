App.PrecapSettingsController = Ember.ArrayController.extend({
    states: [] //moving to external JSON file
    ,countries: [] //moving to external JSON file

    ,actions: {
        hide: function() {
            this.transitionToRoute('precap');
        }
        ,update: function() {
            this.get('model').save();
        }
    }
});
