App.PrecapSendController = Ember.ObjectController.extend({
    sectionsToSend: []
    ,deliverTo: []
    ,subject: ''
    ,additionalNote: 'This is and additional note.'

    ,addItem: function(value) {
        if (!this.sectionsToSend.contains(value)) this.sectionsToSend.addObject(value);
    }
    ,removeItem: function(value){
        this.sectionsToSend = this.sectionsToSend.without(value);
    }
    ,addRecipient: function(value) {
        if (!this.deliverTo.contains(value)) this.deliverTo.addObject(value);
    }
    ,removeRecipient: function(value) {
        this.deliverTo = this.deliverTo.without(value);
    }
    ,sendPrecap: function() {
        console.log('sections:', this.sectionsToSend);
        console.log('recipients:',this.deliverTo);
    }

    ,actions: {
        hide: function() {
            this.transitionToRoute('precap');
        }
        ,itemAdd: function(section) {
            this.addItem(section);
        }
        ,itemRemove: function(section) {
            this.removeItem(section);
        }
        ,recipientAdd: function(recipient) {
            this.addRecipient(recipient);
        }
        ,recipientRemove: function(recipient) {
            this.removeRecipient(recipient);
        }
        ,preview: function() {
            console.log('mock preview');
        }
        ,send: function() {
            console.log('mock sending');
            this.sendPrecap();
        }
    }
});
