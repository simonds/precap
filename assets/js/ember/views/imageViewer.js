App.ImageviewerView = Ember.View.extend({
    attributeBindings: ['style']
    ,classNames: ['PrecapPopover', 'AssetViewer']
    ,tagName: 'div'
    ,imgStyle: ''
    ,templateName: 'Imageviewer'

    ,didInsertElement: function() {
        var _this = this;
        Mousetrap.bind('esc', function() {
            return _this.controller.send('closeModal');
            //return _this.send('closeRouteModal', 'Imageviewer');
        });
    }
    ,actions: {
        closeModal: function() {
            Mousetrap.unbind('esc');
            return this.controller.send('closeModal');
        }
        ,makeDirty: function() {
            this.controllerFor('precap').send('makeDirty');
        }
    }
});
