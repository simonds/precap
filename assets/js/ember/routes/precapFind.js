App.PrecapFindRoute = Ember.Route.extend({
    needs: ['precap']
    ,model: function() {
        return this.store.findAll('precap', { order: 'createdOn'}).then(function(precaps){
            return precaps;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }
    ,afterModel: function(precaps) {
        if (precaps.get('length') === 1) {
           this.transitionTo('precap', precaps[0]);
        }
    }
    ,renderTemplate: function() {
        this.render('precap/find', {
            into: 'precap'
            ,outlet: 'bsheet'
        });
    }
});