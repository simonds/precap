App.TimeView = Ember.TextField.extend({
    classNames: 'Time'
    ,controller: App.PrecapTimelineController
    ,hasChanged: false
    ,timeViewDate: ''
    ,didInsertElement: function() {
        var _this = this;
        this.timeViewDate = this.get('parentView._context.date');
        this.$().attr('value', moment(this.get('data-timestamp')).format('LT'));
        this.$().datetimepicker({
            pickDate: false
            ,minuteStepping: 5
        });
        this.$().on("dp.change", function(e) {
            _this.hasChanged = true;
        });
        this.$().on("dp.hide",function (e) {
            if (_this.hasChanged) {
                _this.set('data-timestamp', moment(_this.timeViewDate+' '+_this.get('value')).valueOf());
                _this.get('targetObject').send('makeDirty');
                _this.hasChanged = false;
            }
        });
    }
});