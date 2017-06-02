var Precap = Precap || {};

Precap.DocumentChooser = new Class({

    Implements: [Precap.BSheet, Options,Events]

    ,options: {
        data: null
        ,className: 'DocumentChooser'
        ,title: 'My Precaps'
    }

    ,initialize: function(options){
        this.setOptions(options);

        this._buildFraming();

        this._getDocuments(function(documentsJSON, err){
            if (err) {
                console.error(err);
            } else {
                this._documents = documentsJSON;
                this._build();
                this._setupEvents();

            }
        });


    }

    ,_build: function(){
        this.getHeader().adopt(
            new Element('div.HeaderControls').adopt(
                new Element('div.PrecapMenuButton').adopt(
                    new Element('div.Icon', {html:'>'})
                    ,new Element('span.Label').grab(
                        new Element('span.SortedByType', {html:'Name'})
                    )
                )
                ,new Element('div.SearchInput').adopt(
                    new Element('div.Icon', {html:'&#160;'})
                    ,new Element('input', {type:'Text',placeholder:'Search'})
                )
                ,new Element('div.PrecapListViewButtons').adopt(
                    this._listViewButton = new Precap.Button({
                        title: 'View List'
                        ,text: 'L'
                        ,size: 'Icon'
                        ,icon: 'ListButton_S'
                        ,onClick: function(){
                            this.fireEvent('showList', this);
                        }.bind(this)
                    })
                    ,this._calendarViewButton = new Precap.Button({
                        title: 'View Calendar'
                        ,text: 'C'
                        ,size: 'Icon'
                        ,icon: 'CalendarButton_S'
                        ,onClick: function(){
                            this.fireEvent('showCalendar', this);
                        }.bind(this)
                    })
                    ,this._calendarViewButton = new Precap.Button({
                        title: 'View Archive'
                        ,text: 'A'
                        ,size: 'Icon'
                        ,icon: 'ArchiveButton_S'
                        ,onClick: function(){
                            this.fireEvent('showArchive', this);
                        }.bind(this)
                    })
                )
            )
        );

        this.getContentContainer().adopt(
            this._listView = new Element('div.PrecapListView').grab(
                this._list = new Element('ul.PrecapList')
            )
            ,this._calendarView = new Element('div.PrecapCalendarView', {html:''})
            ,this._archiveView = new Element('div.PrecapListView.Archive').grab(
                this._archiveList = new Element('ul.PrecapList')
            )
        );

        this.buildList();
    }

    ,_setupEvents: function(){
        this.addEvent('document:clicked', function(doc){
            this.fireEvent('selection', doc);
        }.bind(this));
    }

    ,buildList: function(){
        if (this._documents.length) {
            this._documents.each(function(doc){
                this._list.grab(
                    new Element('li.PrecapListItem', {
                        events: {
                            click: function(){
                                this.fireEvent('document:clicked', doc);
                            }.bind(this)
                        }
                    }).adopt(
                        new Element('div.Info').adopt(
                            new Element('div.PrecapName', {html: doc.name})
                            ,new Element('div.PrecapDetails', {html: moment(doc.date).format('MMMM Do YYYY')})
                        )
                         ,new Element('div.Action').grab(
                            new Precap.Button({
                                size: 'Icon'
                                ,className: 'ArchiveButton_L'
                                ,title: 'Archive this Precap...'
                                ,onClick: function(e){
                                    e.stop();
                                    console.log('Archive coming soon.');
                                }
                            })
                         )
                    )
                );
            }, this);
        }
    }

    ,_getDocuments: function(callback){
        this._userDocumentsRequest = new Request.JSON({
            method: 'get'
            ,url: '/precap/'
            ,noCache: false
            ,onSuccess: function(responseJSON){
                callback.call(this, responseJSON);
            }.bind(this)
            ,onError: function(err){
                callback.call(this, null, err);
            }
        }).send();

        return this;
    }

    ,hide: function(){
        this._html.hide();
    }

    ,show: function(pointTo){
        $$('body')[0].grab(
            this._html
        );
    }

    ,toElement: function() {
        return this._html;
    }
});

