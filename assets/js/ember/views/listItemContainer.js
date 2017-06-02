App.ListItemContainerView = Ember.View.extend({
    tagName: 'div'
    ,classNames: "PrecapCheckbox"
    ,classNameBindings: ['completed:Checked']
    ,action: 'toggleListItemChecked'
    ,template: Ember.Handlebars.compile('✔')
    ,click: function() {
        this.get('controller').send('toggleListItemChecked', this.item);
    }
});