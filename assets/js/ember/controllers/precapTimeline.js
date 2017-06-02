App.PrecapTimelineController = Ember.ObjectController.extend({
    needs: 'precap'
    ,actions: {
        addItem: function(items, timelineDate) {
            var newTimelineItem = window._defaults.timelineItem;
            if (items && items.get('lastObject')) {
                var lastItem = items.get('lastObject');
                newTimelineItem.startTime = moment(lastItem.endTime).add('m', 10).valueOf();
                newTimelineItem.endTime = moment(lastItem.endTime).add('m', 70).valueOf();
            } else {
                newTimelineItem.startTime = moment(timelineDate+'T09:00').valueOf();
                newTimelineItem.endTime = moment(newTimelineItem.startTime).add('h', 1).valueOf();
            }
            items.addObject(newTimelineItem);
        }
        ,makeDirty: function() {
            this.controllerFor('precap').send('makeDirty');
        }
    }
});
