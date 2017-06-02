App.InkFilepickerFile = Ember.Object.extend({
    fileReceived: function (InkBlob) {
        this.set('url', InkBlob.url);
        this.set('filename', InkBlob.filename);
        this.set('ext', InkBlob.filename);
        this.set('size', Math.round((InkBlob.size / 1024 + 0.00001) * 100) / 100);
    }
    ,sizeReceived: function (metadata) {
        this.set('width', metadata.width);
        this.set('height', metadata.height);
        this.set('ready', true);
    }
});
