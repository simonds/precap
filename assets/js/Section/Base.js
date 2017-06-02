
var Precap = Precap || {};
Precap.Section = Precap.Section || {};

Precap.Section.Base = new Class({

    Implements: [Options,Events]

    ,options: {
    }

    // Takes in the section's 'data' object, 
    // an 'options' object, and the precap 'doc'ument.
    ,initialize: function(data, options, doc){
        this.setOptions(options);
        if (doc) this._precapDoc = doc;
        this._data = Object.merge(this._getDefaultData(), (data || {}));
        this.partType = 'section';
        this.id = this._data.id;
        this._buildFraming();
    }

    ,_setupEvents: function(){
        this.addEvent('hideMoveButton', function(){
            this._moveButton.hide();
        }.bind(this));
    }



    // BUILDS
    ,_buildFraming: function(){
        this._html = new Element('section', {
            'class': 'Section'+' '+this._data.type
            ,id: this.id
        }).adopt(
            this._buildHeader()
            ,this._buildContentContainer()
            ,this._buildSectionActions()
        );
    }

    ,_buildHeader: function() {
        this._title = new EditableText(this._data.name, {
            tag: 'h2'
            ,placeholderText: 'A New '+this._data.type
            ,className: 'SectionTitle'
            ,deactivateOn: ['enter', 'tab']
            ,allowLineBreaks: false
            ,onDeactivate: function(editable, hasChanged){
                this.save();
            }.bind(this)
        });
        this._header = new Element('header').grab(
            this._title
        );
        return this._header;
    }

    ,_buildContent: function() {
        // EACH CHILD CLASS NEEDS TO REDEFINE THIS METHOD SPECIFIC TO ITS NEEDS.
        // Must return an element reference to the content HTML

        /* e.g., 
            this._list = new Element('ul.ListList');
            return this._list;
        */
        console.error('Set _buildContent() of child Class.', this);
    }

    ,_buildContentContainer: function() {
        this._contentContainer = new Element('div.ContentContainer');
        return this._contentContainer;
    }

    ,_buildSectionActions: function() {
        var actions = [];
        this._moveButton = new Precap.Button({
            title: 'Drag up or down here to move this Section.'
            ,size: 'Icon'
            ,className: 'SectionMove'
        });

        var confirmBox = new Element('div.DeleteConfirmBox', {
            tween: {
                duration: 150
            }
        }).fade('hide');
        var deleteConfirmText = new Element('span.DeleteConfirmText.Text', {html: 'delete section?'});
        var deleteConfirm = new Precap.Button({
            text: 'yes, delete'
            ,className: 'DeleteConfirm Text'
            ,textOnly: true
            ,onClick: function() {
                this.fireEvent('delete:clicked', this);
            }.bind(this)
        }).disable();
        var deleteNo = new Precap.Button({
            text: 'nevermind'
            ,className: 'DeleteCancel Text'
            ,textOnly: true
            ,onClick: function(e, button) {
                confirmBox.fade('out');
                deleteConfirm.disable();
            }
        });
        this._deleteButton = new Precap.Button({
            title: 'Delete this Section...'
            ,size: 'Icon'
            ,className: 'SectionDelete DeleteButton_L'
            ,onClick: function(e, button){
                confirmBox.fade('in');
                deleteConfirm.enable().activate();
            }
        });

        actions.push(
            this._moveButton,
            this._deleteButton
            ,confirmBox.adopt(
                deleteConfirmText
                ,deleteConfirm
                ,deleteNo
            )
        );
        return actions;
    }



    // DATA
    ,save: function() {
        this._data.name = this._title.getValue();
        this._precapDoc.save();
    }

    ,_getDefaultData: function(){
        console.error('_getDefaultData() needs to be defined per Section sub-class');
        return {};
    }

    ,getData: function() {
        return this._data;
    }

    ,getDataProperty: function(dataProperty) {
        return this._data[dataProperty];
    }

    ,_getContentContainer: function() {
        return this._contentContainer;
    }

    ,firstRun: function(){
        this._title.activate().selectAll();
        // do other stuff here depending on the section.
    }

    ,toElement: function() {
        return this._html;
    }
});