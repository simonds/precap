App.ImageviewerController = Ember.ObjectController.extend({
    needs: ['precap']
    ,actions: {
        closeModal: function() {
            return this.send('closeRouteModal', 'Imageviewer');
        }
        ,makeDirty: function() {
            this.get('controllers.precap')._makeDirty();
        }
    }
});
