App.PrecapFindView = Ember.View.extend({
    animateIn: function(done) {
        _animateIntoBSheet(this.$(), done);
    }
    ,animateOut: function(done) {
        _animateOutBSheet(this.$(), done);
    }
});
