App.FilepickerController = Ember.ObjectController.extend({
    fileServices: ['BOX', 'COMPUTER', 'DROPBOX', 'EVERNOTE', 'GOOGLE_DRIVE', 'SKYDRIVE', 'GMAIL'],
    fileTypes: ['text/*', 'application/*'],
    imageServices: ['COMPUTER', 'FACEBOOK', 'BOX', 'DROPBOX', 'FLICKR', 'PICASA', 'INSTAGRAM'],
    imageTypes: ['image/*'],

    pick: function (serviceType, callback) {
        var _this = this;
        var fileArray = [];
        serviceType = serviceType || 'image';

        filepicker.pick({
            container: 'modal',
            mimetypes: this.get(serviceType + 'Types'),
            services: this.get(serviceType + 'Services')
        }, function (InkBlob) {
            _this.get('content').fileReceived(InkBlob);

            if (_this.get('content').type === 'image') {

                filepicker.stat(InkBlob, {
                    width: true, height: true
                }, function (metadata) {
                    var pendingImage = _this.get('content');
                    pendingImage.sizeReceived(metadata);
                    pendingImage.set('ready', true);
                    fileArray.push(pendingImage);
                    filepicker.convert(InkBlob, {width: 165, height: 165, fit: 'crop'},
                        function(InkBlob165){
                            fileArray.push(InkBlob165);
                            filepicker.convert(InkBlob, {width: 900, height: 900, fit: 'crop'},
                                function(InkBlob900){
                                    fileArray.push(InkBlob900);
                                    callback(fileArray);
                                    _this.destroy();
                                }
                            );
                        }
                    );
                });


            } else {
                callback(InkBlob);
                _this.destroy();
            }
        },
        function (FPError) {
            // unless dialog closed by user
            if (FPError.code !== 101) {
                _this.get('errors').pushObject(FPError.toString());
            }
            _this.destroy();
        });
    }
});
