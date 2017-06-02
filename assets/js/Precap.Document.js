var Precap = Precap || {};

Precap.Document = new Class({

    Implements: [Options, Events]

    ,options: {
        sortable: false
    }

    ,initialize: function(documentData, options){
        this.setOptions(options);
        // The data for our precap document
        this._data = documentData;
        console.log('THIS PRECAP DATA:', this._data);

        // A hash table to store our section objects.
        this._sections = {};
        // An array to store the order of all page elements
        this._pageIndex = [];

        this._setupEvents();

        // if (this._data && this._data.sections && this._data.sections.length) {
            this._build();
        // } else {
            // this._buildEmpty();
        // }

        this._setupDatePicker();
    }

    ,_setupEvents: function() {
        this.addEvent('document:ready', function(){
            // TODO: rejigger sorting...
             if (this.options.sortable && Object.getLength(this.getSections()) > 1) {
              this.refreshSortables();    
             } else {
              this.disableSortables();
             }
        }.bind(this));

        this.addEvent('add:section', function(sectionType, sectionGap){
            var index = this._getIndexOf(sectionGap);
            this.addSection(sectionType, index);
        }.bind(this));
    }

    ,_setupDatePicker: function(){
        this._datePicker = new Precap.DatePicker(this._date, {
            presetValue: this._data.date
            ,positionOffset: {x:-140, y:0}
            ,onSelect: function(date){
                this.setDate(date, this.save);
            }.bind(this)
        });
    }


    // BUILDS
    ,_buildBasicInfo: function() {
        this._name = new EditableText(this._data.name, {
            tag: 'h1'
            ,className: 'Name'
            ,properties: {title:'Edit the name of this precap...'}
            ,allowLineBreaks: false
            ,placeholderText: 'Name your precap'
            ,deactivateOn: 'enter'
            ,onClean: function() {
                this.save();
            }.bind(this)
            ,onDeactivate: function(editable, hasChanged){
                if (hasChanged) this.save();
            }.bind(this)
        });

        this._description = new EditableText(this._data.description, {
            className: 'Description'
            ,tag: 'div'
            ,properties: {title:'Edit the description of this precap...'}
            ,placeholderText: 'Describe your precap'
            ,onBlur: function(et) {
                var val = et.getValue();
                if (val != this._data.description) this.save(val);
            }.bind(this)
            ,onDeactivate: function(editable, hasChanged){
                if (hasChanged) this.save();
            }.bind(this)
        });

        return new Element('section.Section.BasicInfo').adopt(
            this._name
            ,this._date = new Element('div.Date', {html: moment(this._data.date).format('MMMM Do YYYY'), title:'Set a date for this precap...'})
            ,this._description
        );
    }

    ,_buildFooter: function() {
        return new Element('section.Section.Footer').adopt(
            this._archiveThisButton = new Precap.Button({
                text: 'archive this precap'
                ,className: 'ArchivePrecapTrigger'
                ,textOnly: true
                ,onClick: function() {
                    console.error('ARCHIVE THIS PRECAP');
                }
            })
            ,this._deleteThisButton = new Precap.Button({
                text: 'delete this precap'
                ,className: 'DeletePrecapTrigger'
                ,textOnly: true
                ,onClick: function() {
                    console.error('DELETE THIS PRECAP');
                }
            })
        );
    }

    ,_build: function() {
        this._html = new Element('article', {
            'class': 'Precap'
            ,id: 'Precap-'+this._data.id
        }).adopt(
            this._buildBasicInfo()
            ,this._sectionsContainer = new Element('div.UserDefinedSections')
            ,this._buildFooter()
        );

        // add a sectionGap at the top
        var sg = this._createSectionGap();
        this._addToPageIndex(sg.id, sg.toElement(), 'gap');
        this._sectionsContainer.grab(sg);

        // Loop through sections and build each section
        if (this._data.sections) {
            this._data.sections.each(function(sectionData, index, sectionsArray) {

                // build and add the section and next sectionGap
                var newSection = this._buildSection(sectionData);
                var newSectionGap = this._createSectionGap();

                this._addToPageIndex(newSection.id, newSection.toElement(), 'section');
                this._addToPageIndex(newSectionGap.id, newSectionGap.toElement(), 'gap');

                this._sectionsContainer.adopt(
                    newSection
                    ,newSectionGap
                );
            }, this);
        }

        this.fireEvent('document:ready', this);
    }



    /* SECTIONS

    _buildSection : returns the section object. used to manage the building of any section (new or existing). 
    _addNewSection : used to manage the making of a brand new section
    _createSectionGap : returns the sectionGap object. used to simply instantiate a new SectionGap object. 
    _addToPage : used to add any "part" to the page -- a section or sectionGap
    _getPageElements : returns an array containing the primary HTML elements for each page "part"

    */ 
    ,_buildSection: function(sectionData){
        var newSection = new Precap.Section[sectionData.type](sectionData, {}, this);

        // store the section in the section lookup hash
        this._sections[newSection.id] = newSection;

        // make sure it tells the doc how to delete it
        if (newSection.partType == 'section') {
            newSection.addEvent('delete:clicked', function(){
                this.removeSection(newSection);
            }.bind(this));
        }

        return newSection;
    }

    ,addSection: function(type, atPageIndex){
        // make the section, and a new section gap
        var sectionData = {
            type: type
            ,id: type+'-'+String.uniqueID()
        };
        var newSection = this._buildSection(sectionData);
        var newSectionGap = this._createSectionGap();

        // insert the new stuff
        this._pageIndex[atPageIndex].html.grab(newSection, 'after');
        newSection.toElement().grab(newSectionGap, 'after');

        // adjust the pageIndex and make sure we have the new section in .sections
        this._addToPageIndex(newSection.id, newSection.toElement(), 'section', atPageIndex+1);
        this._addToPageIndex(newSectionGap.id, newSectionGap.toElement(), 'gap', atPageIndex+2);

        // page move FX:
        var body = $$('body')[0];
        var tweakScrollFx = new Fx.Scroll(body, {duration: 140});
        tweakScrollFx.start(0, body.scrollTop + 60).chain(function(){
            newSection._title.activate();
            newSection._title.selectAll();
        });
    }

    ,_createSectionGap: function(){
        var sectionGap = new Precap.SectionGap({
            onSelect: function(type, sectionGap){
                 this.fireEvent('add:section', [type, sectionGap])
            }.bind(this)
        });
        sectionGap.id = 'gap-'+String.uniqueID();
        sectionGap.toElement().set('id', sectionGap.id);

        return sectionGap;
    }

    ,removeSection: function(section){
        // get the gap info ready
        var gapIndex = (this._getIndexOf(section))+1;
        var gap = this._pageIndex[gapIndex];

        var secMorph = new Fx.Morph(section.toElement(), {
            duration: 140
            ,onComplete: function(){
                section.toElement().destroy();
            }
        });
        var gapMorph = new Fx.Morph(gap.html, {
            duration: 140
            ,onComplete: function(){
                gap.html.destroy();
            }
        });

        // visually remove the section and gap
        secMorph.start({
            opacity: 0
            ,height: 0
        });
        gapMorph.start({
            opacity: 0
            ,height: 0
        });

        this._removeFromPageIndex(section);
        this._removeFromPageIndex(gap);

        this._deleteSection(section);

        this.save();
    }

    ,_deleteSection: function(section){
        delete this._sections[section.id];
    }

    ,getSections: function(){
        return this._sections;
    }



    // DATA METHODS
    // ...might want to move these into a proper "MODEL" object at some point
    ,getData: function(){
        return this._data;
    }

    ,_prepDataForSave: function(){
        this._data.name = this._name.getValue();
        this._data.description = this._description.getValue();

        this._data.sections = [];
        var secIndex = 0;
        this._pageIndex.each(function(item, index){
            if (item.type == 'section') {
                this._data.sections[secIndex] = this._sections[item.id].getData();
                secIndex = secIndex+1;
            }
        }, this);

        var newData = Object.clone(this._data);
        console.log('saving sections', newData.sections);
        newData.sections = JSON.encode(newData.sections);

        return newData;
    }

    ,save: function() {
        var newData = this._prepDataForSave();
        console.log('SAVING');

        var saver = new Request.JSON({
            method: 'post'
            ,url: '/precap/update'
            ,data: newData
            // ,onSuccess: function(responseJSON){
            //     console.log(responseJSON);
            // }
            ,onError: function(r){ console.error(r); }
        }).send();
    }



    // UTILITY
    ,setDate: function(date, then){
        this._data.date = moment(date).format('YYYY-MM-DD');
        if (then) then.call(this);
    }

    ,getDate: function(){
        return this._data.date || moment().format('YYYY-MM-DD');
    }

    ,_getIndexOf: function(part){
        return this._pageIndex.indexOf(this._pageIndex.getObjectByProperty('id', part.id));
    }

    ,getPageIndex: function(){
        return this._pageIndex;
    }

    ,_getNextIndex: function(){
        return this._pageIndex.length;
    }

    ,_addToPageIndex: function(id, html, type, index){
        if (id && html && type) {
            var index = index || this._getNextIndex();

            this._pageIndex.splice(index, 0, {'id': id, 'html': html, 'type': type});
        }
    }

    ,_removeFromPageIndex: function(part){
        this._pageIndex = this._pageIndex.filter(function(item, index){
            return item.id != part.id;
        });
    }



    // OTHER
    ,hasContacts: function(){
        
    }

    ,refreshSortables: function() {
        if (this._sortables) {
            this._sortables.detach();
            delete this._sortables;         
        }

        this._sortables = new Sortables(this._sectionsContainer, {
            clone: true
            ,opacity: 0
            ,handle: '.SectionMove'
            ,onStart: function(element, clone) {
                console.log('element', element);
                clone.setStyle('z-index', '1000');
            }
            ,onComplete: function() {
                // this.reindexItems();
                this.save(this.getSections());
            }.bind(this)
        });
    }

    ,disableSortables: function(){
        if (this._sortables) {
            this._sortables.detach();
            delete this._sortables;         
        }
        if (this._data.sections) {
            this._data.sections.each(function(section) {
                this._sections[section.id].fireEvent('hideMoveButton');
            }, this);
        }
    }

    ,loadMaps: function(firstLoad) {
        if (this._data.sections) {
            this._data.sections.each(function(section) {
                if (section.type == 'Location') {
                    this._sections[section.id].loadMap(null, firstLoad);
                }
            }, this);
        }
    }

    ,toElement: function() {
        return this._html;
    }
});