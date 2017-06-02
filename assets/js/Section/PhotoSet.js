
Precap.Section.PhotoSet = new Class({
    Extends: Precap.Section.AssetSet

    ,Implements: [Options,Events]

    ,options: {
        dataArrayKeyName: 'photos'
        ,listClassName: 'Photos'
        ,attachmentsMimeTypes: ['image/*']
    }    

    // ASSETS
    ,_buildAsset: function(asset) {
        asset.element = new Element('li', {
            'class': 'Asset Photo'
            ,id: 'Photo-'+asset.id
            ,title: 'View this asset larger...'
        }).grab(
            new Element('img', {
                src: asset.sizes.square_165.url
            })
        );

        asset.element.addEvent('click', function(e){
            e.stop();
            this.viewLargeAsset(asset);
        }.bind(this));

        asset.element.store('assetObject', asset);

        this._list.grab(asset.element);
        this._setupAssetTrigger();
        this.fireEvent('newAsset:added', [asset, this], 50);
    }

    ,getAssets: function(dataOnly) {
        var r = [];
        if (dataOnly) {
            this._assets.each(function(a){
                var o = {
                    index: a.index
                    ,sizes: a.sizes
                    ,inkBlob: a.inkBlob
                };
                if (a.caption) o.caption = a.caption;

                r.push(o);
            });
        } else {
            r = this._assets;
        }
        return r;
    }

    ,viewLargeAsset: function(asset, ready) {
        var windowDimensions = window.getCoordinates();

        if (!ready) {
            asset.element.showSpinner();
            asset.img = new Element('img', {
                src: asset.sizes.max_900.url
                ,styles: {
                    'max-height': windowDimensions.height-140
                    ,'max-width': windowDimensions.width-160
                    ,visibility: 'hidden'
                    ,opacity: 0
                }
                ,events: {
                    load: function(){
                        asset.viewDimensions = asset.img.getDimensions(true);
                        this.viewLargeAsset(asset, true);
                    }.bind(this)
                    ,click: function(){
                        this._viewPopover.destroy();
                        window.precap.hideBodyMask();
                    }.bind(this)
                }
            });

            $$('body')[0].grab(asset.img);
            return;
        } else {
            asset.element.hideSpinner();

            var caption,
                deleteConfirmText,
                deleteConfirm,
                deleteNo,
                deleteButton;

            deleteConfirmText = new Element('span.DeleteConfirmText', {html: 'delete this image?'});
            deleteConfirm = new Precap.Button({
                text: 'yes, delete'
                ,className: 'DeleteConfirm'
                ,textOnly: true
                ,onClick: function() {
                    this.deleteAsset(asset);
                }.bind(this)
            }).disable();
            deleteNo = new Precap.Button({
                text: 'nevermind'
                ,className: 'DeleteCancel'
                ,textOnly: true
                ,onClick: function(e, button) {
                    caption.toElement().show();
                    deleteButton.show('inline-block');
                    button.hide();
                    deleteConfirmText.hide();
                    deleteConfirm.disable().hide();
                }
            });
            deleteButton = new Precap.Button({
                text: 'delete'
                ,className: 'DeleteAssetButton'
                ,textOnly: true
                ,onClick: function(e, button) {
                    button.hide();
                    caption.toElement().hide();
                    deleteConfirmText.show('inline-block');
                    deleteNo.show('inline-block');
                    deleteConfirm.enable().activate().show('inline-block');
                }
            });

            this._viewPopover = new Element('div.PrecapPopover.AssetViewer', {
                tween: {duration: 140}
            }).grab(
                new Element('div.Inner').adopt(
                    new Element('div.Photo').grab(
                        asset.img
                    )
                    ,new Element('footer').adopt(
                        caption = new EditableText(asset.caption, {
                            tag: 'div'
                            ,className: 'Caption'
                            ,allowLineBreaks: false
                            ,placeholderText: 'add a caption'
                            ,deactivateOn: ['enter']
                            ,onClean: function(thisObj, value) {
                                asset.caption = value;
                            }.bind(this)
                            ,onDeactivate: function(thisObj, hasChanged){
                                asset.caption = thisObj.getValue();
                                this.save();
                            }.bind(this)
                        })
                        ,new Element('div.ActionsContainer').adopt(
                            deleteConfirmText.hide()
                            ,deleteConfirm.hide()
                            ,deleteNo.hide()
                            ,deleteButton
                        )
                        // ,new Element('div.PrecapButton.DeleteAssetTrigger.TextOnly').grab(
                        //  new Element('span', {html: 'delete'})
                        // )
                    )
                )
            );

            $$('body')[0].grab(this._viewPopover.fade('hide'));

            var viewPopoverDimensions = this._viewPopover.getDimensions();
            asset.img.setStyles({
                 visibility: 'visible'
                ,opacity: 1
            });
            this._viewPopover.setStyles({
                left: '50%'
                ,top: '50%'
                ,'margin-top': -(viewPopoverDimensions.height/2)
                ,'margin-left': -(viewPopoverDimensions.width/2)
            });

            window.precap.showBodyMask({
                beforeShow: function(){
                    this._viewPopover.fade('in');
                }.bind(this)
                ,afterShow: function() {
                    this._viewLargeAssetIsOpen = true;
                }.bind(this)
                ,beforeHide: function() {
                    this._viewPopover.fade('out');  
                    (function(){
                        this._viewPopover.destroy();
                    }.bind(this)).delay(400);
                }.bind(this)
                ,afterHide: function() {
                    this._viewLargeAssetIsOpen = false;
                }.bind(this)
            });
        }
    }


    // DATA
    ,processNewBlob: function(blob){
        // what a blob looks like:
        // {
        //  url: "https://www.filepicker.io/api/file/VwBOned2Squ3GC05yCvX",
        //  filename: "Screen Shot 2013-08-20 at 2.47.05 PM.png", 
        //  mimetype: "image/png", 
        //  size: 166451, 
        //  isWriteable: true
        // }

        var asset = {
            sizes: {
                original: {
                    width: null
                    ,height: null
                    ,url: blob.url
                    ,filename: blob.filename
                    ,mimetype: blob.mimetype
                }
                ,square_165: {
                    width: 165
                    ,height: 165
                    ,url: blob.url+'/convert?w=165&h=165&fit=crop'
                }
                ,max_900: {
                    width: 900
                    ,height: 900
                    ,url: blob.url+'/convert?w=900&h=900'
                }
            }
            ,inkBlob: Object.clone(blob)
        };
        // get dimensions so we have them
        filepicker.stat(blob, {width: true, height: true},
            function(metadata){
                asset.sizes.original.width = metadata.width;
                asset.sizes.original.height = metadata.height;
            }
        );

        this._newBlobCount = this._newBlobCount - 1;

        this.addAsset(asset);

        if (this._newBlobCount == 0) {
            this.fireEvent('newFilesAdded', this)
            this.save();
        }
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'PhotoSet'
            ,name: 'A New Photoset'
        };
        return data;
    }
});