// TODO:
//  problem with the styles on captions - entering long text breaks things. 
Precap.Section.AssetSet = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {
        listClassName: ''
        ,dataArrayKeyName: ''
        ,attachmentsMimeTypes: []
    }

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        this._data[this.options.dataArrayKeyName] = this._data[this.options.dataArrayKeyName] || [];
        this._assets = (
            this._data[this.options.dataArrayKeyName].length
            ?
            Array.clone(this._data[this.options.dataArrayKeyName])
            :
            []
        );

        this._getContentContainer().adopt(
            this._buildContent()
        );
    
        this._list.addClass(this.options.listClassName);

        var filepicker = window.filepicker || null;
        if (filepicker) {
            this._filepickerIsActive = true;
            filepicker.setKey('AFbmnJ7XvQqOaMWhBwtR3z');    
            // console.log('filepicker loaded.');
        } else {
            this._filepickerIsActive = false;
            console.log('filepicker failed to load.');
        }

        this._setupAssetTrigger();
        this._setupEvents();
        if (filepicker) {
            this._setupFilepicker();
        }
        this.refreshSortables();
    }



    // BUILDS
    ,_buildContent: function(){
        this._list = new Element('ul.AssetSetAssets');
        this._buildAssets();
        return this._list;
    }

    ,_buildAssets: function() {
        if (this._assets.length) {
            this._assets.each(function(asset, index) {
                asset.index = index;
                this._buildAsset(asset)
            }, this);
        }
    }



    // SETUPS
    ,_setupFilepicker: function() {
        var debugMode = false;
        var mimetypesAllowed = this.options.attachmentsMimeTypes;
        var servicesAllowed = [
            'COMPUTER'
            ,'DROPBOX'
            ,'INSTAGRAM'
            ,'FACEBOOK'
            ,'FLICKR'
            ,'EVERNOTE'
            ,'BOX'
            ,'GOOGLE_DRIVE'
            ,'PICASA'
        ];

        // The 'picker' options, the 1st parameter to be used with the .pickAndStore method of filepicker
        this._filepickerPickerOptions = {
            mimetypes: mimetypesAllowed
            ,services: servicesAllowed
            ,multiple: true
            ,debug: debugMode
        };

        // The 'store' options, the 2nd parameter to be used with the .pickAndStore method of filepicker
        this._filepickerOptionsStoreOptions = {
            location: 'S3'
            ,path: ''
            ,access: 'public'
        };

        // The 'onSuccess' callback, the 3rd parameter to be used with the .pickAndStore method of filepicker
        this._filepickerOptionsOnSuccess = function(inkBlobs){
            this._newBlobCount = inkBlobs.length;
            inkBlobs.each(function(blob) {
                this._processNewBlob(blob);
            }, this);
        }.bind(this);

        // The 'onError' callback, the 4th parameter to be used with the .pickAndStore method of filepicker
        this._filepickerOptionsOnError = function(FPError){
            console.log(FPError.toString());
        }.bind(this);


        // Setup the drop pane (for drag-drop uploading)
        filepicker.makeDropPane(this._newTrigger, {
            mimetypes: mimetypesAllowed
            ,services: servicesAllowed
            ,multiple: true
            ,location: 'S3'
            ,path: ''
            ,access: 'public'
            ,dragEnter: function() {
                this._newTrigger.addClass('Over');
            }.bind(this)
            ,dragLeave: function() {
                this._newTrigger.removeClass('Over');
            }.bind(this)
            ,onStart: function() {
                this._newTrigger.addClass('Loading');
            }.bind(this)
            ,onSuccess: function(inkBlobs) {
                console.log('inkBlobs', inkBlobs);
                this._newTrigger.removeClass('Loading');
                this._newTriggerText.set('html', '+');
                this._newBlobCount = inkBlobs.length;
                inkBlobs.each(function(blob) {
                    this._processNewBlob(blob);
                }, this);
            }.bind(this)
            ,onError: function(type, message) {
                if (type == 'WrongType') {
                    alert('You tried to upload a file with a filetype that is not allowed. Please try again.');
                }
                console.error(type, message);
            }.bind(this)
            ,onProgress: function(percentage) {
                this._newTriggerText.set('html', 'Uploading...<br/>'+percentage+'%'+ 'done');
            }.bind(this)
        });
    }

    ,_setupEvents: function() {
        this.addEvent('newAssetTrigger:clicked', function(){
            filepicker.pickAndStore(
                this._filepickerPickerOptions
                ,this._filepickerOptionsStoreOptions
                ,this._filepickerOptionsOnSuccess
                ,this._filepickerOptionsOnError
            );
        }.bind(this));

        this.parent();
    }

    ,_setupAssetTrigger: function() {
        if (!this._newTrigger) {
            this._newTrigger = new Element('li.AddAsset.NewTrigger', {
                title: 'Add a new asset...'
            }).grab(
                this._newTriggerText = new Element('span.Text', {html: '+'})
            );

            this._newTrigger.addEvent('click', function(){
                this.fireEvent('newAssetTrigger:clicked', this);
            }.bind(this));
        }

        this._list.grab(this._newTrigger,'bottom');
    }



    // ASSETS & ASSET LIST
    ,addAsset: function(asset) {
        this._assets.push(asset);
        this._buildAsset(asset);
        this.reindexAssets();
    }

    ,deleteAsset: function(asset) {
        asset.element.destroy();
        if (this._viewLargeAssetIsOpen) {
            this._viewPopover.destroy();
            window.precap.hideBodyMask();
        }
        filepicker.remove(asset.inkBlob, function(){
            console.log('Removed from filepicker');
        });
        this._assets.erase(asset);
        this.reindexAssets();
        this.save();
    }

    ,reindexAssets: function() {
        this._assets.empty();
        this.getListElements().each(function(li, index) {
            var assObj = li.retrieve('assetObject');
            assObj.index = index;
            this._assets.push(assObj);
        }, this);
    }

    ,_saveAsset: function(asset, callback) {
        console.log('SAVE PHOTO', asset);
        // fake what the handler/DB will do... add an id
        asset.id = String.uniqueID();
        if (callback) {
            callback.call(this);
        }
    }

    ,getAssets: function(dataOnly) {
        // defined per sub-class
    }

    ,getList: function() {
        return this._list;
    }

    ,getListElements: function() {
        var arr = this._list.getElements('li');
        // remove the "Add new..." <li>...
        arr.pop();
        return arr;
    }



    // DATA
    ,_processNewBlob: function(blob) {
        // each sub-class will handle this differently
    }

    ,save: function(){
        console.log('SAVE');

        this._data[this.options.dataArrayKeyName] = this.getAssets(1);

        console.log('data', this._data[this.options.dataArrayKeyName]);
        this.parent();
    }



    // UTILITY
    ,refreshSortables: function() {
        if (this._sortables) {
            this._sortables.detach();
            delete this._sortables;         
        }

        this._sortables = new Sortables(this.getList(), {
            clone: true
            ,opacity: 0
            ,onSort: function(){
                this._orderHasChanged = 1;
            }.bind(this)
            ,onStart: function(element, clone) {
                clone.setStyle('z-index', '1000');
            }
            ,onComplete: function(element) {
                if (this._orderHasChanged) {
                    this.reindexAssets();
                    this._orderHasChanged = 0;
                    this.save();    
                    this.refreshSortables();
                }
            }.bind(this)
        });
    }
});
