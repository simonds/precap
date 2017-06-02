
Precap.Section.List = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        this._items = (this._data.items ? Array.clone(this._data.items) : []);

        this._getContentContainer().adopt(
            this._buildContent()
            ,this._buildContentFooter()
        );

        this._setupEvents();
        if (this._items.length == 0) {
            this.addItem(0);
        }

        if (this.someChecked()) {
            this._hideShowTrigger.show('inline-block');
        } else {
            this._hideShowTrigger.hide();
        }

        this.refreshSortables();
    }

    ,_setupEvents: function() {
        this.addEvent('newItemTrigger:clicked', function(){
            this.addItem(null, true);
        }.bind(this));

        this.parent();
    }



    // BUILDS
    ,_buildHeader: function() {
        this._title = new EditableText(this._data.name, {
            tag: 'h2'
            ,placeholderText: 'A Note Section'
            ,className: 'SectionTitle'
            ,deactivateOn: 'enter'
            ,allowLineBreaks: false
            ,onTab: function(thisEditable){
                thisEditable.deactivate();
                this.getItems()[0].editable.activate();
            }.bind(this)
            ,onDeactivate: function(){
                this.save();
            }.bind(this)
        });
        this._header = new Element('header').grab(
            this._title
        );
        return this._header;
    }

    ,_buildContent: function(){
        this._list = new Element('ul.ListList');
        this._buildListItems();
        return this._list;
    }

    ,_buildListItems: function() {
        if (this._items.length) {
            this._items.each(function(i, index) {
                i.index = index;
                this._injectItem(this._buildListItem(i));
            }, this);
        }
    }

    ,_buildListItem: function(item) {
        item = item || {
            checked: false
            ,text: '&#160;'
        };
        // Set up the keyboard shortcuts to be used for editing an item...
        var keyboardKeys = {
            down: function(e) {
                e.preventDefault();
                if (this._items[item.index+1]) {
                    item.editable.deactivate();
                    this._items[item.index+1].editable.activate();
                }
            }.bind(this)
            ,up: function(e) {
                e.preventDefault();
                if (this._items[item.index-1]) {
                    item.editable.deactivate();
                    this._items[item.index-1].editable.activate();
                }
            }.bind(this)
            ,enter: function(){
                if (!item.editable.isEmpty()) {
                    item.editable.deactivate();

                    var injectIndex;
                    if (item.index == this._items.length-1) {
                        injectIndex = this._items.length;
                    } else {
                        injectIndex = item.index+1;
                    }
                    this.addItem(injectIndex, true);
                }
            }.bind(this)
        };

        item.element = new Element('li', {
            'class': 'ListItem'+(item.checked ? ' Complete':'')
            ,reveal: {
                duration: 100
                ,display: 'table'
            }
        }).adopt(
            new Element('div.ListCheckbox').grab(
                item.checkbox = new Precap.Checkbox({
                    onToggle: function(){
                        // check to see if we have anything else toggled.
                        if (this.someChecked()) {
                            this._hideShowTrigger.show('inline-block');
                        } else {
                            this._hideShowTrigger.hide();
                        }

                        this.save();
                    }.bind(this)
                })
            )
            ,item.editable = new EditableText(item.text, {
                className: 'ListItemText'
                ,allowLineBreaks: false
                ,allowTabbing: false
                ,activateOn: 'click'
                // ,deactivateOn: 'enter'
                ,placeholderText: 'Type your list item here'
                ,keys: keyboardKeys
                ,onActivate: function(et) {
                    this._activeEditable = et;
                    this._sortables.detach();
                }.bind(this)
                ,onDeactivate: function(et) {
                    if (et.isEmpty() && item.index != 0) {
                        this.deleteItem(item);
                        this.reindexItems();
                    }
                    this._sortables.attach();
                    this.save();
                }.bind(this)
                ,onClean: function(){
                    this.save();
                }.bind(this)
                ,onEmpty: function() {
                    this._armItemForDeleteOrSave(item, 'delete');
                }.bind(this)
            })
        );

        if (item.checked) item.checkbox.check(true);
        item.element.store('itemObject', item);

        return item;
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

    ,_buildContentFooter: function(){
        this._contentFooter = new Element('div.ContentFooter').adopt(
            new Element('div.Left').grab(
                this._newTrigger = new Precap.Button({
                    title: 'Add a new item to this list...'
                    ,text: 'Add Item'
                    ,className: 'NewItemText Instructive'
                    ,textOnly: true
                    ,onClick: function(){
                        this.fireEvent('newItemTrigger:clicked', this);
                    }.bind(this)
                })
            )
            ,new Element('div.Right').grab(
                this._hideShowTrigger = new Precap.Button({
                    title: 'Toggle the visibility of completed items'
                    ,text: 'Hide Completed'
                    ,className: 'Instructive HideShow'
                    ,textOnly: true
                    ,onClick: function(e, button){
                        if (button.getText() == 'Hide Completed') {
                            button.setText('Show Completed');
                            this.getItems().each(function(item){
                                if (item.checkbox.isChecked()) {
                                    item.element.dissolve();
                                }
                            });
                        } else {
                            button.setText('Hide Completed');
                            this.getItems().each(function(item){
                                if (item.checkbox.isChecked()) {
                                    item.element.reveal();
                                }
                            });
                        }
                    }.bind(this)
                })
            )
        );

        return this._contentFooter;
    }           



    // UTILITY
    ,_getDefaultData: function(){
        var data = {
            type: 'List'
            ,name: 'A New List'
        };
        return data;
    }

    ,_armItemForDeleteOrSave: function(item, action) {
        var doAction = function(e){
            switch (action){
                case 'delete': 
                    if (e.key == 'backspace') {
                        this.deleteItem(item, true);
                    }
                    item.editable.html.removeEvent('keyup', doAction);
                    break;
                case 'save': 
                    if (e.key == 'backspace') {
                        this.deleteItem(item, true);
                    } else if (e.key.toString().length == 1 && /^[a-z0-9]+$/i.test(e.key)) {
                        console.log('SAVE NEW ITEM', item);
                        item.editable.html.removeEvent('keyup', doAction);
                    }
                    break;
            }
        }.bind(this);

        item.editable.html.addEvent('keyup', doAction);
    }

    ,_getActiveEditable: function() {
        return this._activeEditable;
    }



    // LIST ITEMS
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
        this.save();
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
        this.reindexItems();
        this.save();
    }

    ,getItems: function(dataOnly) {
        var returnable;
        if (dataOnly) {
            var dataOnlyItems = (function(){
                var i = []; 
                this._items.each(function(item){
                    i.push({
                        checked: item.checkbox.isChecked()
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

    ,getList: function() {
        return this._list;
    }

    ,getListElements: function() {
        return this.getList().getElements('li');
    }

    ,someChecked: function(){
        var some = 0;
        this.getItems().each(function(item){
            if (item.checkbox.isChecked()) {
                some++
            }
        });
        return (some);
    }


    // PUBLIC METHODS
    ,save: function(){
        this._data.name = this._title.getValue();
        this._data.items = this.getItems(true);
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

    ,refreshSortables: function() {
        if (this._sortables) {
            this._sortables.detach();
            delete this._sortables;         
        }

        this._sortables = new Sortables(this.getList(), {
            clone: true
            ,opacity: 0
            ,dragOptions: {
                snap: 10
                ,preventDefault: true
            }
            ,onSort: function(){
                this._orderHasChanged = 1;
            }.bind(this)
            ,onComplete: function(element) {
                if (this._orderHasChanged) {
                    this.reindexItems();
                    this._orderHasChanged = 0;
                    this.save();    
                    this.refreshSortables();
                }
            }.bind(this)
        });
    }

    ,disableSortables: function(){
        if (this._sortables) {
            this._sortables.detach();
            delete this._sortables;         
        }
        this._data.sections.each(function(section) {
            this._sections[section.id].fireEvent('hideMoveButton');
        }, this);
    }

    ,firstRun: function(){
        this.addItem();
        this._title.activate().selectAll();
    }
});