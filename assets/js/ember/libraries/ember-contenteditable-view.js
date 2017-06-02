var Ember = Ember || null;
var Mousetrap = Mousetrap || null;

Ember.ContenteditableView = Ember.View.extend({
    tagName: 'div'
    ,attributeBindings: ['contenteditable']
    ,classNameBindings: ['active']
    ,emptyCrumbsList: ['<br>','<p>','&nbsp;','&#160;', '""']

    // Variables:
    ,editable: false
    ,Active: false
    ,allowLineBreaks: false
    ,allowTabbing: false
    ,placeholderText: ''
    ,placeholderOnEmpty: true
    ,saveEmptyValue: false
    ,escToBlur: true
    ,enterToNew: false
    ,returnHTML: true
    ,autoClean: true
    ,autoCleanInterval: 2500
    ,isUserTyping: false
    ,plaintext: false
    ,sectionType: ''

    // Properties:
    ,contenteditable: (function() {
        var editable = this.get('editable');

        return editable ? 'true' : undefined;
    }).property('editable')

    // Observers:
    ,valueObserver: (function() {
        if (!this.get('isUserTyping') && this.get('value')) {
            return this.setContent();
        }
    }).observes('value')

    // Events:
    ,didInsertElement: function() {
        return this.setContent();
    }

    ,focusIn: function() {
        var that = this;
        if (this.get('allowLineBreaks') === false) {
            Mousetrap.bind('enter', function() {
                that.$().blur();
            });
        }
        if (this.get('escToBlur')) {
            Mousetrap.bind('esc', function() {
                that.$().blur();
            });
        }
        if (this.get('allowTabbing')) {
            Mousetrap.bind('tab', function() {
                console.log('need to go to next element');
            });
        }
        if (this.get('enterToNew')) {
            Mousetrap.bind('enter', function() {
                console.log('need to add an element');
                that.get('controller').send('add' + that.get('sectionType') + 'Item');
                return false;
            });
        }
        return this.set('active', true);
    }

    ,focusOut: function() {
        this.set('active', false);
        var newContent = '';

        if (this.get('plaintext')) {
            newContent = this.$().text();
        } else {
            newContent = this.$().html();
        }

        if (this.get('value') != newContent) {
            this.set('value', newContent);
            this.get('controller').send('makeDirty');
        }

        if (this.get('allowLineBreaks') === false) Mousetrap.unbind('enter');
        if (this.get('escToBlur')) Mousetrap.unbind('esc');
        if (this.get('allowTabbing')) Mousetrap.unbind('tab');
        if (this.get('enterToNew')) Mousetrap.unbind('enter');
        return this.set('isUserTyping', false);

        //this.get('controller').send('commitRecord');
        //return this.get('controller').send('commitRecord');
    }
/*
    ,keyDown: function(event) {
        if (this.get('allowLineBreaks') === false && event.keyCode == 13) return false;
        if (!event.metaKey) {
            return this.set('isUserTyping', true);
        }
    }

    ,keyUp: function(event) {

        if (this.get('plaintext')) {
            return this.set('value', this.$().text());
        } else {
            return this.set('value', this.$().html());
        }
    }
*/
    ,setContent: function() {
        if (this.get('value') === null && this.get('placeholderOnEmpty')) this.set('value', this.get('placeholderText'));
        return this.$().html(this.get('value'));
    }

});