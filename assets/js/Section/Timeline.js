
Precap.Section.Timeline = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        this._items = (this._data.items ? Array.clone(this._data.items) : []);

        // If this is a new section being added, set the date to today.
        this._data.date = this._data.date || moment(doc.getDate()).format("YYYY-MM-DD");

        this._getContentContainer().adopt(
            this._buildContent()
            ,this._buildContentFooter()
        );

        // this.setTimelineDate(this._data.date, 1);
        this._setupEvents();
        this._setupTimeRanger();
        this._setupDatePicker();
    }

    ,_setupEvents: function(){
        this.addEvent('newItemTrigger:clicked', function(){
            this.addItem();
        }.bind(this));

        this.addEvent('showTimeRanger', function(item, pointTo, click){
            this._currentlyTimeRangedItem = item;
            // set values
            console.log('item', item);

            var startTime = moment(item.startTime).format('HH:mm');
            var endTime = moment(item.endTime).format('HH:mm');

            // show it
            this._timeRanger.setTimes(startTime, endTime).show(pointTo);
        }.bind(this));

        this.addEvent('timeRanger:done:clicked', function(times){
            var item = this._currentlyTimeRangedItem;

            item.startTime = moment(this._data.date+'T'+times.startTime).valueOf();
            item.endTime = moment(this._data.date+'T'+times.endTime).valueOf();

            item.startTimeTrigger.set('html', moment(item.startTime).format('LT'));
            item.endTimeTrigger.set('html', moment(item.endTime).format('LT'));

            this.reorderEvents();

            this.save();
        }.bind(this));

        this.addEvent('newItem:added', function(item){
            this._items.push(item);
        }.bind(this));

        this.addEvent('deleteEntry:clicked', function(item){
            var index = this.getItems().indexOf(item);
            this.getItems().splice(index, 1);

            this.save();
        });

        this.parent();
    }

    ,_setupTimeRanger: function(){
        this._timeRanger = new TimeRanger({
            startTime: '12:00'
            ,endTime: '12:00'
            ,pointToOffset: {x:-20,y:-5}
            ,onDone: function(times){
                this.fireEvent('timeRanger:done:clicked', times);
            }.bind(this)
            ,onShow: function(){
                this._currentlyTimeRangedItem.timeSpan.addClass('Active');
            }.bind(this)
            ,onHide: function(){
                this._currentlyTimeRangedItem.timeSpan.removeClass('Active');
            }.bind(this)
        });
    }

    ,_setupDatePicker: function(){
        this._datePicker = new Precap.DatePicker(this._dateChoiceTrigger, {
            presetValue: this._data.date
            ,dateDisplayStringMod: function(dateObj){
                return moment(dateObj).format('dddd, MMMM Do YYYY');
            }
            ,onSelect: function(date){
                this.setTimelineDate(date, this.save);
            }.bind(this)
        });
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'Timeline'
            ,name: 'A New Timeline'
        };
        return data;
    }



    // BUILDS
    ,_buildHeader: function(){
        this._title = new EditableText(this._data.name, {
            tag: 'h2'
            ,title: 'Edit the title for this timeline...'
            ,placeholderText: 'A New '+this._data.type
            ,returnHTML: false
            ,className: 'SectionTitle'
            ,deactivateOn: ['enter']
            ,allowLineBreaks: false
            ,onDeactivate: function(){
                this.save();
            }.bind(this)
            ,onTab: function(thisObj){
                thisObj.deactivate();
                this._datePicker.attach().open();
            }.bind(this)
        });
        this._header = new Element('header').grab(
            this._title
        );
        return this._header;
    }

    ,_buildContent: function(){
        this._dayContainer = new Element('div.Day').adopt(
            this._dateChoiceTrigger = new Element('time.Day-Date', {
                title: 'Set the date for this timeline...'
                ,html: moment(this._data.date).format('dddd, MMMM Do YYYY')
            })
            ,this._list = new Element('ol.TimelineList')
        );

        this._buildItems();
        return this._dayContainer;
    }

    ,_buildItems: function() {
        this._list.empty();
        if (this._items.length) {
            this._items.each(function(item, index) {
                // item.index = index;
                this.addItem(item, index);
            }, this);
        }
    }

    ,addItem: function(itemObj, index) {
        var item = itemObj;
        var isNew = !item;

        // If this is our very first item...
        if (!item) {
            item = {};
            if (!this._items.length) {
                item.startTime = moment(this._data.date+'T09:00').valueOf();
                item.endTime = moment(item.startTime).add('h', 1).valueOf();
            } else 
            // If we already have items, and we are building a NEW item...
            {
                item.index = this._items.length;
                // start this new item 10 minutes after the end of the last item.
                var lastItem = this._items.getLast();
                item.startTime = moment(lastItem.endTime).add('m', 10).valueOf();
                item.endTime = moment(lastItem.endTime).add('m', 10).add('h', 1).valueOf();
            }
        } else {
            item.index = index.toString().toInt();
        }

        item.element = new Element('li.TimelineItem').adopt(
            item.timeSpan = new Element('div.TimeSpan', {
                events: {
                    click: function(e){
                        e.stop();
                        this.fireEvent('showTimeRanger', [item, item.timeSpan, e]);
                    }.bind(this)
                }
            }).adopt(
                item.startTimeTrigger = new Element('time', {
                    title: 'Change the start time for this item...'
                    ,html: moment(item.startTime).format('LT')
                })
                ,new Element('span', {html: ' &#150; '})
                ,item.endTimeTrigger = new Element('time', {
                    title: 'Change the end time for this item...'
                    ,html: moment(item.endTime).format('LT')
                })
            )
            ,item.editable = new EditableText(item.text, {
                className: 'TimelineItemText'
                ,returnHTML: false
                ,allowLineBreaks: false
                ,placeholderText: 'Type a description here'
                ,placeholderOnEmpty: false
                ,keys: {
                    'enter': function(){
                        item.editable.deactivate();

                        this.fireEvent('newItemTrigger:clicked');
                    }.bind(this)
                }
                ,onDeactivate: function(thisObj){
                    if (thisObj.isEmpty()) {
                        this.deleteItem(item);
                    }
                    item.text = thisObj.getValue();
                    this.save();
                }.bind(this)
                ,onClean: function(thisObj){
                    item.text = thisObj.getValue();
                    this.save();
                }.bind(this)
                ,onEmpty: function() {
                    this._armItemForDelete(item);
                }.bind(this)
            })
        );

        item.element.store('itemObject', item);
        this._list.grab(item.element);

        if (isNew) {
            // this.fireEvent('showTimeRanger', [item, item.timeSpan]);
            item.editable.activate();
            this.fireEvent('newItem:added', [item, this]);
        }
    }

    ,_buildContentFooter: function(){
        this._contentFooter = new Element('div.ContentFooter').adopt(
            new Element('div.Left').grab(
                this._newTrigger = new Precap.Button({
                    title: 'Add a new entry to this timeline...'
                    ,className: 'NewItemText Instructive'
                    ,textOnly: true
                    ,text: 'Add Entry'
                    ,onClick: function(){
                        this.fireEvent('newItemTrigger:clicked', this);
                    }.bind(this)
                })
            )
            /* this will take a little figurin' out...  and is only applicable on the DAY OF an event
                Need to determine if we are ON THE DAY, 
                then determine whether the CURRENT TIME is GREATER THAN the times of 
                events in this timeline, and hide the ones that have already past. 
            */
            // ,new Element('div.Right').grab(
            //  this._hideShowTrigger = new Precap.Button({
            //      title: 'Toggle the visibility of completed items'
            //      ,text: 'Hide Completed'
            //      ,className: 'Instructive HideShow'
            //      ,textOnly: true
            //      ,onClick: function(e, button){
            //          if (button.getText() == 'Hide Completed') {
            //              button.setText('Show Completed');

            //          } else {
            //              button.setText('Hide Completed');

            //          }
            //      }.bind(this)
            //  })
            // )
        );

        return this._contentFooter;
    }           



    // OTHER
    ,_armItemForDelete: function(item) {
        var doAction = function(e){
            if (e.key == 'backspace') {
                this.deleteItem(item, true);
            }
            item.editable.html.removeEvent('keyup', doAction);
        }.bind(this);

        item.editable.html.addEvent('keyup', doAction);
    }

    ,deleteItem: function(item, focusOnPrev) {
        item.element.destroy();
        this._items.erase(item);

        if (this._items.length == 0) {
            this.addItem(null, true);
        } else if (focusOnPrev && item.index !== 0) {
            this._items[item.index-1].editable.activate(0, true);
        }
        if (!focusOnPrev) {
            this.reorderEvents();
        }
        this.save();
    }

    ,setTimelineDate: function(date, then){
        this._data.date = moment(date).format('YYYY-MM-DD');
        if (then) then.call(this);
        return this;
    }

    ,getItems: function(dataOnly) {
        var returnable;
        if (dataOnly) {
            var dataOnlyItems = (function(){
                var i = []; 
                this._items.each(function(item){
                    i.push({
                        startTime: item.startTime
                        ,endTime: item.endTime
                        ,text: item.editable.getValue()
                    });
                });
                return i;
            }.bind(this))();
            returnable = dataOnlyItems;
        } else {
            returnable = this._items;
        }

        return returnable;
    }

    ,reorderEvents: function(){
        var temp = this.getItems().sortBy('startTime', 'asc');
        this._items = temp;
        this._buildItems();
    }

    ,save: function(){
        this._data.name = this._title.getValue();
        this._data.items = this.getItems(true);
        this.parent();
    }

    ,toElement: function() {
        return this._html;
    }
});