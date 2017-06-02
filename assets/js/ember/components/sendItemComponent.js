App.SendItemComponent = Ember.Component.extend({
    tagName: 'li'
    ,classNames: 'SectionLine'
    ,classNameBindings: ['typeClass', 'isUnselected:Unselected']
    ,typeClass: ''
    ,isUnselected: true

    ,didInsertElement: function() {
        this.set('typeClass', this.get('section.type'));
        this.sendAction('itemAdd', this.get('section'));
        this.set('isUnselected', false);
    }

    ,actions: {
        click: function(section) {
            this.set('isUnselected', this.get('isUnselected') ? false: true);
            this.sendAction(this.get('isUnselected') ? 'itemRemove': 'itemAdd', section);
        }
    }
});