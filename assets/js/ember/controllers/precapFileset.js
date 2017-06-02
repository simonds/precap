App.PrecapFilesetController = Ember.ObjectController.extend({
    needs: 'precap'
    ,actions: {
        addItem: function(files) {
            var newFile, fp;
            newFile = App.InkFilepickerFile.create({ready: false, type: 'file'});
            fp = App.FilepickerController.create({
                content: newFile,
                errors: this.get('errors')
            });
            var _this = this;
            fp.pick('file', function(file) {
                var newFile = window._defaults.fileItem;
                newFile.filename = file.filename;
                newFile.url = file.url;
                newFile.ext = getFileExt(file.filename).toUpperCase();
                files.addObject(newFile);
                _this.controllerFor('precap').send('makeDirty');
            });
        }
        ,downloadFile: function(url) {
            window.location = url + '?dl=true';
        }
        ,deleteFile: function(file, files) {
            files.removeObject(file);
            this.controllerFor('precap').send('makeDirty');
        }
        ,clearErrors: function () {
            this.get('errors').clear();
        }
        ,setSelected: function (newSelection) {
            this.set('selectedImage', newSelection);
        }
        ,makeDirty: function() {
            this.controllerFor('precap').send('makeDirty');
        }
    }
});
