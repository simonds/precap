App.PrecapSendRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('precap');
    }
    ,renderTemplate: function() {
        this.render('precap/send', {
            into: 'precap'
            ,outlet: 'bsheet'
        });
    }
});