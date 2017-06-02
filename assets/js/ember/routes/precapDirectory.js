App.PrecapDirectoryRoute = Ember.Route.extend({
    needs: ['contact']
    ,model: function() {
        return this.store.findAll('contact').then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }
    ,renderTemplate: function() {
        this.render('precap/directory', {
            into: 'precap'
            ,outlet: 'bsheet'
        });
    }
});