
Precap.Section.Note = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        this._getContentContainer().grab(
            this._buildContent()
        );
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'Note'
            ,name: 'A New Note'
        };
        return data;
    }

    ,_buildHeader: function() {
        this._title = new EditableText(this._data.name, {
            tag: 'h2'
            ,placeholderText: 'A Note Section'
            ,className: 'SectionTitle'
            ,deactivateOn: ['enter', 'tab']
            ,allowLineBreaks: false
            ,onTab: function(){
                this._noteBody.activate();
            }.bind(this)
            ,onDeactivate: function(editable, hasChanged){
                this.save();
            }.bind(this)
        });
        this._header = new Element('header').grab(
            this._title
        );
        return this._header;
    }

    ,_buildContent: function(){
        this._noteBody = new EditableText(this._data.body, {
            tag: 'div'
            ,allowTabbing: true
            ,placeholderText: 'Type the body of your note here'
            ,className: 'NoteBody'
            ,keys: {
                'shift+tab': function(e){
                    e.preventDefault();
                    this._noteBody.deactivate();
                    this._title.activate();
                }.bind(this)
            }
            ,onClean: function() {
                this.save();
            }.bind(this)
            ,onDeactivate: function(editable, hasChanged){
                if (hasChanged) this.save();
            }.bind(this)
        });

        return this._noteBody.toElement();
    }

    ,save: function(){
        this._data.name = this._title.getValue();
        this._data.body = this._noteBody.getValue();
        this.parent();
    }
});

