App.PrecapRoute = Ember.Route.extend({
    model: function(params) {
        if (params.precap_id === null) return this.transitionToRoute('precap.find');
        return this.store.find('precap', params.precap_id).then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }
    ,clearOutlet: function(container, outlet) {
        var parentView = this.router._lookupActiveView(container);
        parentView.disconnectOutlet(outlet);
    }
    ,actions: {
        loading: function(transition, originRoute) {
            displayLoadingSpinner();
            return true;
        }
        ,openRouteModal: function(templateName, context) {
            this.controllerFor(templateName).set('model', context);
            return this.render(templateName, {
                into: 'precap'
                ,outlet: 'modal'
                ,controller: templateName
            });
        }
        ,closeRouteModal: function(templateName) {
            //this.controllerFor(templateName).send('reset');
            this.clearOutlet('precap', 'modal');
            toggleBodyMask('out');
        }
    }
});