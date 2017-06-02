App.PrecapController = Ember.ObjectController.extend(Ember.AutoSaving,{

    needs: [
        'precapList'
        ,'map'
        ,'precapTimeline'
        ,'precapImageset'
        ,'precapFileset'
        ,'precapContactGroup'
    ]

    ,_addLocation: function(context, position) {
        var location = context || window._defaults.location
        ,locationView = Ember.View.create({
            templateName: '_sectionLocation'
            ,context: location
        });
        this._addSection(location, locationView, position);
    }

    ,_addGroup: function(context, position) {
        var group = context || window._defaults.group
        ,groupView = Ember.View.create({
            templateName: '_sectionGroup'
            ,context: group
        });
        this._addSection(group, groupView, position);
    }

    ,_addList: function(context, position) {
        var list = context || window._defaults.list
        ,listView = Ember.View.create({
            templateName: '_sectionList'
            ,context: list
        });
        this._addSection(list, listView, position);
    }

    ,_addNote: function(context, position) {
        var note = context || window._defaults.note
        ,noteView = Ember.View.create({
            templateName: '_sectionNote'
            ,context: note
        });
        this._addSection(note, noteView, position);
    }

    ,_addTimeline: function(context, position) {
        var timeline = context || window._defaults.timeline;
        if (timeline.date === null) timeline.date = this.get('date');
        var timelineView = Ember.View.create({
            templateName: '_sectionTimeline'
            ,context: timeline
        });
        this._addSection(timeline, timelineView, position);
    }

    ,_addPhotoset: function(context, position) {
        var photoset = context || window._defaults.photoset
        ,photosetView = Ember.View.create({
            templateName: '_sectionPhotoset'
            ,context: photoset
        });
        this._addSection(photoset, photosetView, position);
    }

    ,_addFileset: function(context, position) {
        var fileset = context || window._defaults.fileset
        ,filesetView = Ember.View.create({
            templateName: '_sectionFileset'
            ,context: fileset
        });
        this._addSection(fileset, filesetView, position);
    }

    ,_addSection: function(object, view, position) {
        //console.log('passed position', position);
        var containerView = Ember.View.views['UserDefinedSections'];
        if (position >= 0) {
            var objectPosition = position+1
            ,gapPosition = position+2
            ,arrayPosition = (position === 0) ? 0 : position  - (position/2);
            //console.log('inserting section at position', objectPosition);
            containerView.insertAt(objectPosition, view);
            this.get('model')._data.sections.splice(arrayPosition, 0, object);
            var gapView = App.SectionGapComponent.create({position:gapPosition});
            //console.log('inserting gapView at position', gapPosition);
            containerView.insertAt(gapPosition, gapView);
        } else {
            containerView.pushObject(view);
            this.get('model')._data.sections.addObject(object);
        }
    }

    ,_buildSections: function() {
        var containerView = Ember.View.views['UserDefinedSections'];
        containerView.destroyAllChildren();

        var gapView = App.SectionGapComponent.create({position:0});
        containerView.pushObject(gapView);

        var sections = this.get('sections');
        var _this = this;
        if (sections) {
            sections.forEach(function(item, index) {
                switch (item.type) {
                    case 'Location':
                        _this._addLocation(item);
                        break;
                    case 'Group':
                        _this._addGroup(item);
                        break;
                    case 'List':
                        _this._addList(item);
                        break;
                    case 'Note':
                        _this._addNote(item);
                        break;
                    case 'Timeline':
                        _this._addTimeline(item);
                        break;
                    case 'PhotoSet':
                        _this._addPhotoset(item);
                        break;
                    case 'FileSet':
                        _this._addFileset(item);
                        break;

                }
                var positionVar = (index+1) * 2;
                var gapView = App.SectionGapComponent.create({position: positionVar});
                containerView.pushObject(gapView);

            });

        }
    }
    ,_makeDirty: function() {
        this.set('saved', true);
    }

    ,contacts: function() {
        return this.store.findAll('contact').then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }

    ,contactchooserToRender: null

    ,actions: {
        buildSections: function() {
            this._buildSections();
        }
        ,commitRecord: function(){
            var precap = this.get('model');
            precap.commitRecord();
        }
        ,makeDirty: function(){
            this._makeDirty();
        }
        ,mapVisibilityToggle: function () {
            this.get('controllers.map').send('visibilityToggle');
            //this.controllerFor('map').send('visibilityToggle');
        }
        ,addListItem: function(items) {
            this.get('controllers.precapList').send('addItem', items);
            //this.controllerFor('precapList').send('addItem', items);
        }
        ,toggleListItemChecked: function(item) {
            this.get('controllers.precapList').send('toggleListItemChecked', item);
            //this.controllerFor('precapList').send('toggleListItemChecked', item);
        }
        ,addTimelineItem: function(items, date) {
            this.get('controllers.precapTimeline').send('addItem', items, date);
            //this.controllerFor('precapTimeline').send('addItem', items, date);
        }
        ,addFile: function (type, files) {
            if (type === 'image') {
                this.get('controllers.precapImageset').send('addItem', files);
                //this.controllerFor('precapImageset').send('addItem', files);
            } else {
                this.get('controllers.precapFileset').send('addItem', files);
                //this.controllerFor('precapFileset').send('addItem', files);
            }
        }
        ,viewImage: function(image) {
            this.get('controllers.precapImageset').send('viewImage', image);
            //this.controllerFor('precapImageset').send('viewImage', image);
        }
        ,deleteImage: function(image, images) {
            this.get('controllers.precapImageset').send('deleteImage', image, images);
            //this.controllerFor('precapImageset').send('deleteImage', image, images);
        }
        ,downloadFile: function(url) {
            this.get('controllers.precapFileset').send('downloadFile', url);
            //this.controllerFor('precapFileset').send('downloadFile', url);
        }
        ,deleteFile: function(file, files) {
            this.get('controllers.precapImageset').send('deleteFile', file, files);
            //this.controllerFor('precapImageset').send('deleteFile', file, files);
        }
        ,openContactChooser: function(view) {
            this.get('controllers.precapContactGroup').send('openContactChooser', view);
        }
        ,closeContactChooser: function() {
            this.get('controllers.precapContactGroup').send('closeContactChooser');
        }
        ,showSend: function() {
            _bSheetsLoaded = _bSheetsLoaded+1;
            this.transitionToRoute('precap.send');
        }
        ,showDirectory: function() {
            _bSheetsLoaded = _bSheetsLoaded+1;
            this.transitionToRoute('precap.directory');
        }
        ,showFind: function() {
            _bSheetsLoaded = _bSheetsLoaded+1;
            this.transitionToRoute('precap.find');
        }
        ,showSettings: function(){
            _bSheetsLoaded = _bSheetsLoaded+1;
            this.transitionToRoute('precap.settings');
        }
        ,newPrecap: function(){

        }
        ,createSection: function(type, position) {
            switch (type) {
                case 'Location':
                    this._addLocation(null, position);
                    break;
                case 'Group':
                    this._addGroup(null, position);
                    break;
                case 'List':
                    this._addList(null, position);
                    break;
                case 'Note':
                    this._addNote(null, position);
                    break;
                case 'Timeline':
                    this._addTimeline(null, position);
                    break;
                case 'PhotoSet':
                    this._addPhotoset(null, position);
                    break;
                case 'FileSet':
                    this._addFileset(null, position);
                    break;
            }
        }
    }
});
