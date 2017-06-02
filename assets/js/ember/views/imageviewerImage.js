App.ImageviewerImageView = Ember.View.extend({
    attributeBindings: ['src']
    ,tagName: 'img'
    ,windowDimensions: {
        height: $(window).height()
        ,width: $(window).width()
    }

    ,click: function(e) {
        return this.get('parentView').send('closeModal');
    }

    ,didInsertElement: function() {
        var _this = this;
        this.$().on('load', function(evt){
            return _this.imageLoaded(evt);
        }).on('error', function(evt){
            return _this.imageError(evt);
        });
    }
    ,willDestroyElement: function(){
        this.$().off('load', 'error');
    }
    ,imageLoaded: function(event){
        toggleBodyMask('in');
        this.$().attr('style', 'max-height:' + eval(this.get('windowDimensions.height')-140) + 'px; max-width:' + eval(this.get('windowDimensions.width')-160) + 'px;');
        var lightBox = $('div.AssetViewer')
        ,viewPopoverDimensions = {
            height: lightBox.height()
            ,width: lightBox.width()
        };
        lightBox.attr('style', 'left:50%; top:50%; margin-top:-'+(viewPopoverDimensions.height/2)+'px; margin-left:-'+(viewPopoverDimensions.width/2)+'px;');
        lightBox.show();
    }
    ,imageError: function(event){
        console.log("there was an error wasn't there! - 1");
    }
});
