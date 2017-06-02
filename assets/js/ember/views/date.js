App.DateView = Ember.TextField.extend({
    classNames: 'Date'

    ,didInsertElement: function() {
        var setValue;
        if (this.get('isFullFormatted')) {
            setValue = moment(this.get('value')).format('LLLL');
        } else {
            setValue = moment(this.get('value')).format('LL');
        }
        this.$().attr('value', setValue);
        this.$().datetimepicker({
            pickTime: false
            ,showToday: true
        });
    }
});