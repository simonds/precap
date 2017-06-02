App.SectionsView = Ember.ContainerView.extend({
    elementId: 'UserDefinedSections'
    ,classNames: ['UserDefinedSections']
    ,didInsertElement: function() {
        this.get('controller').send('buildSections');
    }
    ,modelChanged: function() {
        this.get('controller').send('buildSections');
    }.observes('controller.model')
});