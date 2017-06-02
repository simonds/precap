App.PrecapSettingsRoute = Ember.Route.extend({
    needs: ['user']
    ,model: function() {
        return this.store.find('user').then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }
    ,renderTemplate: function() {
        this.render('precap/settings', {
            into: 'precap'
            ,outlet: 'bsheet'
        });
    }
});