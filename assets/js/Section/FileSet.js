Precap.Section.FileSet = new Class({
    Extends: Precap.Section.AssetSet

    ,Implements: [Options,Events]

    ,options: {
        dataArrayKeyName: 'files'
        ,listClassName: 'Files'
        ,attachmentsMimeTypes: ['*/*']
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'FileSet'
            ,name: 'A New FileSet'
        };
        return data;
    }

    ,_buildAsset: function(asset) {
        var caption;
        asset.element = new Element('li.Asset.File', {
            'class': 'Asset File'
            ,id: 'File-'+asset.id
            ,title: 'Download this file...'
        }).adopt(
            new Element('div.Icon').adopt(
                new Element('span.Ext', {html: asset.ext.toUpperCase()})
            )
            ,new Element('div.FileName', {html: asset.filename})
        );

        asset.element.addEvent('click', function(e){
            e.stop();
            this.downloadFile(asset);
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
                    ,inkBlob: a.inkBlob
                    ,filename: a.filename
                    ,ext: a.ext
                };

                r.push(o);
            });
        } else {
            r = this._assets;
        }
        return r;
    }

    ,_processNewBlob: function(blob) {
        // what a blob looks like:
        // {
        //  url: "https://www.filepicker.io/api/file/VwBOned2Squ3GC05yCvX",
        //  filename: "Screen Shot 2013-08-20 at 2.47.05 PM.png", 
        //  mimetype: "image/png", 
        //  size: 166451, 
        //  isWriteable: true
        // }

        var asset = {
            ext: (function(){
                var str = blob.filename;
                var ext;
                for (var i = str.length - 1; i >= 0; i--) {
                    if (str[i] == '.') {
                        ext = str.substr(i+1, str.length-i);
                        break;
                    }
                };
                return ext;
            })()
            ,filename: blob.filename
            ,inkBlob: Object.clone(blob)
        };

        this._newBlobCount = this._newBlobCount - 1;

        this.addAsset(asset);

        if (this._newBlobCount == 0) {
            this.fireEvent('newFilesAdded', this)
            this.save();
        }
    }

    ,downloadFile: function(asset) {
        window.open(asset.filepath, '_blank');
        console.error('NEED a more node-y way to download files');
    }

});
