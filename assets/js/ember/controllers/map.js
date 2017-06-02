App.MapController = Ember.ObjectController.extend({
    isHidden: false
    ,actions: {
        visibilityToggle: function() {
            this.toggleProperty('isHidden');
        }
    }
});
