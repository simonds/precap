var Precap = Precap || {};

Precap.Directory = new Class({

    Implements: [Precap.BSheet, Options,Events]

    ,options: {
        className: 'DirectoryView'
        ,title: 'Directory'
    }

    ,initialize: function(options){
        this.setOptions(options);

        this._data = {};

        this.getContacts(null, 10, 0, 'firstName', 'ASC', function(contactsJSON, err){
            if (contactsJSON) {
                this._data.contacts = {contacts:contactsJSON};
                this.fireEvent('data:loaded', this);
            }
            if (err) {
                console.error(err);
                return;
            }
        }.bind(this));

        this._buildFraming();
        this._build();
        this._setupEvents();
    }

    ,_build: function(){


    }

    ,_setupEvents: function() {
        this.addEvent('data:loaded', function(){
            this.loadContacts();
        });
    }

    ,getContacts: function(filter, limit, skip, sort, direction, callback){
        var _filter = filter || null
            ,_skip = skip || null
            ,_limit = limit || null
            ,_sort = sort || null
            ,_direction = direction || null;
        this._userDocumentsRequest = new Request.JSON({
            method: 'get'
            ,url: '/contact'
            ,data: {
                filter: _filter
                ,skip: _skip
                ,limit: _limit
                ,sort: _sort
                ,direction: _direction
            }
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

    ,loadFilters: function() {
        
    }

    ,loadContacts: function(docData) {
        var container = this.getContentContainer();

        container.getElements('*').dispose();

        var engine = new MTEEngine.Markup();

        var dataForTemplateTabIndex = {letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']};

        var dataForTemplateDirectoryList = this._data.contacts;

        engine.load('/templates/directory.html', {}, function(templates) {
            container.adopt(templates.templateDirectoryTabIndex.render(dataForTemplateTabIndex));
            container.children[0].getChildren().each(function(letter){
                letter.addEvent('click', function (e) {
                    var _this = precap._directoryView;
                    _this.getContacts(letter.innerText, 10, 0, 'firstName', 'ASC', function(contactsJSON, err){
                        if (contactsJSON) {
                            _this._data.contacts = {contacts:contactsJSON};
                            _this.loadContacts();
                        }
                        if (err) {
                            console.error(err);
                            return;
                        }
                    }.bind(this));
                }.bind(this));
            });
            container.adopt(templates.templateDirectoryList.render(dataForTemplateDirectoryList));
        });

        return this;
    }
});