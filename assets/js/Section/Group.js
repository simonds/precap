
Precap.ContactList = new Class({
    Implements: [Options,Events]

    ,options: {
        dataURL: '/contact/'
        ,getContactsOnInit: false
    }

    ,initialize: function(options){
        this.setOptions(options);

        this._html = new Element('ul.ContactList');

        this._setupEvents();

        if (this.options.getContactsOnInit) {
            this.get(1);
        }
    }

    ,_setupEvents: function(){
        this.addEvent('avatar:clicked', function(contact){
            this.fireEvent('select', [contact, this]);
        }.bind(this))

        this.addEvent('name:clicked', function(contact){
            this.fireEvent('select', [contact, this]);
        }.bind(this))

        this.addEvent('email:clicked', function(emailAddr){
            this.fireEvent('email', [emailAddr, this]);
        }.bind(this))
    }

    ,_buildList: function(){
        var self = this;
        this._contacts.each(function(contact, index, array){
            var c = self._buildListItem(contact);
            self._html.grab(
                c.element
            );
            if (index == array.length-1) {
                self.fireEvent('ready', this);
            }
        });
    }

    ,_buildListItem: function(contact) {

        contact = contact || {};

        contact.element = new Element('li', {
            'class': 'Contact'+' '+(contact.type ? contact.type.capitalize() : '')+' vcard'
        });

        var makeAvatar = function(contact){
            return new Element('div.Avatar', {
                title: 'Select this contact'
                ,events: {
                    click: function(){
                        this.fireEvent('avatar:clicked', contact);
                    }.bind(this)
                }
            }).grab(
                new Element('img', {src: contact.imagePath})
            );
        }.bind(this);
        // PERSON
        if (contact.type == 'person') {
            contact.element.set('id', 'hcard-'+contact.firstName+'-'+contact.lastName);
            contact.element.adopt(
                makeAvatar(contact)
                ,new Element('span.Name.fn.n', {
                    html: contact.firstName+' '+contact.lastName
                    ,title: 'Select this contact'
                    ,events: {
                        click: function(){
                            this.fireEvent('name:clicked', contact);
                        }.bind(this)
                    }
                })
                // ,(contact.title ? new Element('span.Title', {html: contact.title}) : '')
                ,(contact.email ? new Element('span.Email').grab(
                    new Element('a.email', {
                        html: contact.email
                        ,events: {
                            click: function(){
                                this.fireEvent('email:clicked', contact.email);
                            }.bind(this)
                        }
                    })
                ) : '')
                ,(contact.phone ? new Element('span.Phone.tel', {html: contact.phone}) : '')
            );
        } else 
        // COMPANY
        if (contact.type == 'company') {
            contact.element.set('id', 'hcard-'+contact.company.replace(/\s/g, '-'));
            contact.element.adopt(
                makeAvatar(contact)
                ,new Element('span.Name.fn.org', {
                    html: contact.company
                    ,title: 'Select this contact'
                    ,events: {
                        click: function(){
                            this.fireEvent('name:clicked', contact);
                        }.bind(this)
                    }
                })
                ,(contact.firstName || contact.lastName 
                    ? new Element('span.PrimaryContact', {html: (contact.firstName || '')+' '+(contact.lastName || '')})
                    : ''
                )
                // ,(contact.title ? new Element('span.Title', {html: contact.title}) : '')
                ,(contact.email ? new Element('span.Email').grab(
                    new Element('a.email', {
                        html: contact.email
                        ,events: {
                            click: function(){
                                this.fireEvent('email:clicked', contact.email);
                            }.bind(this)
                        }
                    })
                ) : '')
                ,(contact.phone ? new Element('span.Phone.tel', {html: contact.phone}) : '')
            );
        }

        contact.element.store('contactObject', contact);

        return contact;
    }

    ,get: function(buildListOnSuccess, callback){
        this._userDocumentsRequest = new Request.JSON({
            method: 'get'
            ,url: this.options.dataURL
            ,noCache: false
            ,onSuccess: function(responseJSON){
                if (responseJSON) {
                    this._contacts = responseJSON;
                    this.fireEvent('dataLoaded', this);

                    if (buildListOnSuccess) this._buildList();
                    if (callback) callback.call(this, responseJSON);
                }
            }.bind(this)
            ,onError: function(err){
                callback.call(this, null, err);
            }
        }).send();

        return this;
    }

    ,toElement: function(){
        return this._html;
    }
});

//////////////////////////////////////////////////

Precap.ContactChooser = new Class({
    Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);

        this._build();

        this._list = new Precap.ContactList({
            getContactsOnInit: true
            ,onReady: function(){
                this._listContainer.empty().grab(
                    this._list.toElement()
                )
            }.bind(this)
        });
    }

    ,_setupEvents: function(){
        this.addEvent('data:loaded', function(){
            this._buildList();
        }.bind(this));

        this.addEvent('contact:clicked', function(contact){
            this.fireEvent('select', [contact,this]);
        }.bind(this));

        this.addEvent('createContact', function(contact){
            var newContactStr = this._input.getValue();
            // Detect if the string has a space(s) - if so, try to split into first / last names smartly ? 
            /* Show create contact dialog 
                [firstName] [lastName] [email] [saveBtn]
            */
        }.bind(this));
    }

    ,_build: function(){
        this._html = new Element('div.ContactChooser');
        this._input = new EditableText('', {
            tag: 'p'
            ,title: 'Type a name to search directory'
            ,properties: {}
            ,allowLineBreaks: false
            ,placeholderText: 'Type a name'
            ,autoClean: true
            ,autoCleanInterval: 2500
            ,emptyCrumbsList: ['<br>','<p>','&nbsp;','&#160;', '""']
            ,keys: {} // keyboard shortcuts... key = the key, value = function
            ,onKeyup: function(){}
        });
        
        this._html.adopt(
            this._input
            ,this._listContainer = new Element('div.ListContainer')
            ,this._createContactButton = new Precap.Button({
                text: 'Create'
                ,className: 'CreateContactButton'
                ,onClick: function(){
                    this.fireEvent('createContact');
                }.bind(this)
            })
        );
    }

    ,toElement: function(){
        return this._html;
    }
});







Precap.Section.Group = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        this._contacts = (this._data.contacts ? Array.clone(this._data.contacts) : []);

        this._getContentContainer().adopt(
            this._buildContent()
            ,this._buildContentFooter()
        );
        this._setupEvents();
        // this._setupContactChooser();
        this.activateSortables();
    }

    ,_setupEvents: function() {
        this.addEvent('addContactTrigger:clicked', function(){
            this.contactChooser = this.contactChooser || new Precap.ContactChooser();

            // animate this:
            this._getContentContainer().grab(
                this.contactChooser
            );
        }.bind(this));

        this.addEvent('viewContact', function(contact){
            console.log('view contact', contact);
            alert('View & Edit Contact - coming soon.');
        }.bind(this));

        this.parent();
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'Group'
            ,name: 'A New Group'
        };
        return data;
    }



    // BUILDS
    ,_buildContent: function(){
        this._list = new Element('ul.GroupList.ContactList');
        this._buildListItems();
        return this._list;
    }

    ,_buildListItems: function() {
        if (this._contacts.length) {
            this._contacts.each(function(i, index) {
                i.index = index;
                this._injectItem(this._buildListItem(i));
            }, this);
        }
    }

    ,_injectItem: function(item, activateOnInject){
        var list = this.getListElements();
        if (list.length) {
            list[item.index-1].grab(item.element, 'after');
        } else {
            this.getList().grab(item.element);
        }
        if (activateOnInject) {
            item.editable.activate();
            this._sortables.addItems(item.element);
        }

        this.fireEvent('item:added', [item, this]);
    }

    ,_buildListItem: function(item) {
        item = item || {};

        item.element = new Element('li', {
            'class': 'Contact'+' '+item.type.capitalize()+' vcard'
        });

        // PERSON
        if (item.type == 'person') {
            item.element.set('id', 'hcard-'+item.firstName+'-'+item.lastName);
            item.element.adopt(
                new Element('div.Avatar', {
                    title: 'View this contact'
                    ,events: {
                        click: function(){
                            this.fireEvent('viewContact', item);
                        }.bind(this)
                    }
                }).grab(
                    new Element('img', {src: item.imagePath})
                )
                ,new Element('span.Name.fn.n', {
                    html: item.firstName+' '+item.lastName
                    ,title: 'View this contact'
                    ,events: {
                        click: function(){
                            this.fireEvent('viewContact', item);
                        }.bind(this)
                    }
                })
                ,(item.title ? new Element('span.Title', {html: item.title}) : '')
                ,(item.email ? new Element('span.Email').grab(
                    new Element('a.email', {
                        html: item.email
                        ,href:'mailto:'+item.email+'?Subject='+(this._precapDoc ? 'Re: '+this._precapDoc.getData().name : '')})
                ) : '')
                ,(item.phone ? new Element('span.Phone.tel', {html: item.phone}) : '')
            );
        } else 
        // COMPANY
        if (item.type == 'company') {
            item.element.set('id', 'hcard-'+item.company.replace(/\s/g, '-'));
            item.element.adopt(
                new Element('div.Avatar', {html:'&#160;'})
                ,new Element('span.Name.fn.org', {html: item.company})
                ,(item.firstName || item.lastName 
                    ? new Element('span.PrimaryContact', {html: (item.firstName || '')+' '+(item.lastName || '')})
                    : ''
                )
                ,(item.title ? new Element('span.Title', {html: item.title}) : '')
                ,(item.email ? new Element('span.Email').grab(
                    new Element('a.email', {
                        html: item.email
                        ,href:'mailto:'+item.email+'?Subject='+(this._precapDoc ? 'Re: '+this._precapDoc.getData().name+' - ' : '')})
                ) : '')
                ,(item.phone ? new Element('span.Phone.tel', {html: item.phone}) : '')
            );
        }

        item.element.store('itemObject', item);

        return item;
    }

    ,_buildContentFooter: function(){
        /*
        <div class="NewPersonGutter NewThingGutter">
            <div class="NewItemText" title="Add a new person to this group...">New Person</div>
        </div>
        */
        this._contentFooter = new Element('div.ContentFooter').adopt(
            new Element('div.Left').grab(
                this._newTrigger = new Precap.Button({
                    title: 'Add a new person to this group...'
                    ,text: 'Add Contact'
                    ,className: 'NewItemText Instructive'
                    ,textOnly: true
                    ,onClick: function(){
                        this.fireEvent('addContactTrigger:clicked', this);
                    }.bind(this)
                })
            )
        );

        return this._contentFooter;
    }           



    ,addItem: function(index, activate) {
        var item = {};
        if (this._items.length == 0) {
            item.index = 0;
        } else {
            item.index = index || this._items.length;
        }

        // determine where to put it
        if (item.index != this._items.length) {
            this._items.splice(item.index, 0, item);
        } else {
            this._items.push(item);
        }

        this._injectItem(this._buildListItem(item), activate);
    }

    ,deleteItem: function(item, focusOnPrev) {
        item.element.destroy();
        this._items.erase(item);
        console.log('DELETE ITEM', item);

        if (this._items.length == 0) {
            this.addItem(null, true);
        } else if (focusOnPrev && item.index !== 0) {
            this._items[item.index-1].editable.activate(null, true);
        }
        //this.reindexItems();
    }

    ,getItems: function() {
        return this._items;
    }

    ,getList: function() {
        return this._list;
    }

    ,getListElements: function() {
        return this.getList().getElements('li');
    }

    ,save: function(content) {
        console.log('do group save prep here');
        this.parent();
    }

    ,reindexItems: function() {
        this._items.empty();
        this.getListElements().each(function(li, index) {
            var itemObj = li.retrieve('itemObject');
            itemObj.index = index;
            this._items.push(itemObj);
        }, this);
    }

    ,activateSortables: function() {
        this._sortables = new Sortables(this.getList(), {
            clone: true
            ,opacity: 0
            ,dragOptions: {
                snap: 0
                // ,onSnap: function(){
                //  this._dragging = true;
                // }.bind(this)
            }
            ,onStart: function(element, clone) {
                // element.getElement('.EditableText').retrieve('EditableText').deactivate();
                // clone.setStyle('z-index', 5000).getElement('.EditableText').addClass('Clone');
            }
            ,onComplete: function() {
                if (this._dragging) {
                    this._dragging = false;
                    //this.reindexItems();
                    // this.refreshSortables();
                }

                // this.save(this.getItems());
            }.bind(this)
        });
    }

    ,firstRun: function(){
        // this.addItem();
        this._title.activate().selectAll();
        // do other stuff here depending on the section.
    }
});