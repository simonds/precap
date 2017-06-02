App.PrecapImagesetController = Ember.ObjectController.extend({
    needs: ['precap']
    ,actions: {
        addItem: function(files) {
            var newImg, fp;
            newImg = App.InkFilepickerFile.create({ready: false, type: 'image'});
            fp = App.FilepickerController.create({
                content: newImg,
                errors: this.get('errors')
            });
            var _this = this;
            fp.pick('image', function(imageArray) {
                var newImage = window._defaults.photoItem;
                newImage.caption = imageArray[0].filename;
                newImage.sizes.original.width = imageArray[0].width;
                newImage.sizes.original.height = imageArray[0].height;
                newImage.sizes.original.url = imageArray[0].url;
                newImage.sizes.square_165.url = imageArray[1].url;
                newImage.sizes.max_900.url = imageArray[2].url;
                files.addObject(newImage);
                _this.controllerFor('precap').send('makeDirty');
            });
        }
        ,viewImage: function(image) {
            return this.send('openRouteModal', 'Imageviewer', image);
        }
        ,deleteImage: function(file, files) {
            files.removeObject(file);
            this.get('controllers.precap')._makeDirty();
        }
        ,clearErrors: function () {
            this.get('errors').clear();
        }
        ,makeDirty: function() {
            this.get('controllers.precap')._makeDirty();
        }
    }
});
