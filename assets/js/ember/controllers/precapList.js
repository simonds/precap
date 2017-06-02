App.PrecapListController = Ember.ObjectController.extend({
    needs: 'precap'
    ,actions: {
        addItem: function(items) {
            if (items) {
                items.addObject(window._defaults.listItem);
            } else {
                console.log('Need to get items array.');
                //this.items.addObject(window._defaults.listItem);
            }

        }
        ,toggleListItemChecked: function(item) {
            Ember.set(item, 'completed', item.completed ? false: true);
            this.controllerFor('precap').send('makeDirty');
        }
    }
});
